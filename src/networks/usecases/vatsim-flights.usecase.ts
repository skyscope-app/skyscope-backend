import { Airline } from '@/airlines/domain/airline';
import { AirlinesService } from '@/airlines/services/airlines.service';
import { AirportsService } from '@/airports/airports.service';
import { Airport } from '@/airports/domain/airports.entity';
import { CacheService } from '@/cache/cache.service';
import { HttpService } from '@/http/http.service';
import {
  Aircraft,
  AirlineResponse,
  FlightPlan,
  LiveFlight,
} from '@/networks/dtos/live-flight.dto';
import {
  VatsimDataFlightPlan,
  VatsimDataPilot,
} from '@/networks/dtos/vatsim.dto';
import { Nullable } from '@/shared/utils/nullable';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import Redis from 'ioredis';
import { v5 } from 'uuid';

@Injectable()
export class VatsimFlightsUsecase {
  constructor(
    private readonly airportsService: AirportsService,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly airlinesService: AirlinesService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  public async fetchLiveFlights(): Promise<Array<LiveFlight>> {
    const [data, airports, airlines] = await Promise.all([
      this.redis.get('ivao').then((r) => {
        if (r) {
          return JSON.parse(r).clients.pilots as VatsimDataPilot[];
        }

        return [];
      }),
      this.airportsService.getAirportsMap(),
      this.airlinesService.list(),
    ]);

    const airlinesByIcao = new Map(
      airlines.map((airline) => [airline.icao, airline]),
    );

    const flights = this.parse(data, airports, airlinesByIcao);

    return flights;
  }

  private parseVatsimAircraftWakeTurbulence(aircraft: string) {
    const regex = new RegExp(`\/(.+)\-`);
    const wakeTurbulence = regex.exec(aircraft)?.pop();

    return wakeTurbulence as string;
  }

  private parseVatsimAircraftEquipment(aircraft: string) {
    const regex = new RegExp(`-(.+)\/`);
    const equipment = regex.exec(aircraft)?.pop();

    return equipment as string;
  }

  private parseVatsimAircraftTransponderEquipmentCode(aircraft: string) {
    const regex = new RegExp(`\/.+.*?\/(.+)$`);
    const transponderCode = regex.exec(aircraft)?.pop();

    return transponderCode as string;
  }

  private parseVatsimFlightPlan(
    flight_plan: Nullable<VatsimDataFlightPlan>,
    airports: Map<string, Airport>,
  ): Nullable<FlightPlan> {
    if (!flight_plan) {
      return null;
    }

    const departure = airports.get(flight_plan.departure);
    const arrival = airports.get(flight_plan.arrival);
    const alternate = airports.get(flight_plan.alternate);

    return {
      flightRules: flight_plan.flight_rules,
      flightType: '',
      departure: {
        icao: flight_plan.departure,
        iata: departure?.iata ?? '',
        name: departure?.name ?? '',
        lat: departure?.latitude ?? 0,
        lng: departure?.longitude ?? 0,
      },
      arrival: {
        icao: flight_plan.arrival,
        iata: arrival?.iata ?? '',
        name: arrival?.name ?? '',
        lat: arrival?.latitude ?? 0,
        lng: arrival?.longitude ?? 0,
      },
      aircraft: new Aircraft({
        icao: flight_plan.aircraft_short,
        wakeTurbulence: this.parseVatsimAircraftWakeTurbulence(
          flight_plan.aircraft,
        ),
        registration: (flight_plan.remarks.match(/REG\/(\w+)/) || [])[1] || '',
        transponderTypes: this.parseVatsimAircraftTransponderEquipmentCode(
          flight_plan.aircraft,
        ),
        equipment: this.parseVatsimAircraftEquipment(flight_plan.aircraft),
      } as Aircraft),
      level: Number(flight_plan.altitude),
      route: flight_plan.route,
      remarks: flight_plan.remarks,
      cruiseTas: flight_plan.cruise_tas,
      departureTime: flight_plan.deptime,
      enrouteTime: flight_plan.enroute_time,
      endurance: flight_plan.fuel_time,
      alternate:
        flight_plan.alternate !== ''
          ? {
              icao: flight_plan.alternate,
              iata: alternate?.iata ?? '',
              name: alternate?.name ?? '',
              lat: alternate?.latitude ?? 0,
              lng: alternate?.longitude ?? 0,
            }
          : null,
      alternate2: null,
    };
  }

  private parse(
    pilots: VatsimDataPilot[],
    airports: Map<string, Airport>,
    airlinesByIcao: Map<string, Airline>,
  ): LiveFlight[] {
    if (!pilots) {
      return [];
    }

    return pilots.map((data) => {
      const airline = airlinesByIcao.get(data.callsign.slice(0, 3));

      return {
        id: v5(
          crypto
            .createHash('md5')
            .update(
              `${
                data.cid +
                data.callsign +
                data.flight_plan?.departure +
                data.flight_plan?.arrival +
                data.flight_plan?.deptime
              }`,
            )
            .digest('hex'),
          '820aabf8-e662-4075-8e9f-8a94dc1f5148',
        ),
        network: 'vatsim',
        callsign: data.callsign,
        pilot: {
          id: data.cid,
          rating: '',
          name: data.name,
        },
        position: {
          lat: data.latitude,
          lng: data.longitude,
          altitude: data.altitude,
          heading: data.heading,
          transponder: data.transponder,
          groundSpeed: data.groundspeed,
          onGround: this.detectGround(data, airports), // TODO: Implement this
        },
        flightPlan: this.parseVatsimFlightPlan(data.flight_plan, airports),
        airline: airline ? new AirlineResponse(airline) : null,
      };
    });
  }

  private detectGround(
    pilot: VatsimDataPilot,
    airports: Map<string, Airport>,
  ): any {
    if (!pilot.flight_plan) {
      return false;
    }

    const departure = airports.get(pilot.flight_plan.departure);
    const arrival = airports.get(pilot.flight_plan.arrival);
    const alternate = airports.get(pilot.flight_plan.alternate);

    const shortAirport = [departure, arrival, alternate].find((airport) => {
      if (!airport) {
        return false;
      }

      const distance = Math.sqrt(
        Math.pow(Math.abs(pilot.latitude - airport.latitude), 2) +
          Math.pow(Math.abs(pilot.longitude - airport.longitude), 2),
      );

      return distance < 2;
    });

    if (!shortAirport) {
      return false;
    }

    const height = pilot.altitude - shortAirport.elevation;

    return height < 30;
  }
}
