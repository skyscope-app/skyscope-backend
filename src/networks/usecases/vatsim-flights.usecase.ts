import { Airport } from '@/airports/airports.entity';
import { AirportsService } from '@/airports/airports.service';
import { CacheService } from '@/cache/cache.service';
import { HttpService } from '@/http/http.service';
import {
  Aircraft,
  FlightPlan,
  LiveFlight,
} from '@/networks/dtos/live-flight.dto';
import {
  VatsimData,
  VatsimDataFlightPlan,
  VatsimDataPilot,
} from '@/networks/dtos/vatsim.dto';
import { Nullable } from '@/shared/utils/nullable';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { v5 } from 'uuid';

@Injectable()
export class VatsimFlightsUsecase {
  private url = 'https://data.vatsim.net/v3/vatsim-data.json';

  constructor(
    private readonly airportsService: AirportsService,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {}

  public async fetchLiveFlights(): Promise<Array<LiveFlight>> {
    return this.cacheService.handle(
      'vatsim_current_live',
      async () => {
        const [{ data }, airports] = await Promise.all([
          this.httpService.get<VatsimData>(this.url),
          this.airportsService.getAirportsMap(),
        ]);

        const flights = this.parse(data.pilots, airports);

        return flights;
      },
      15,
    );
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
        lat: departure?.lat ?? 0,
        lng: departure?.lng ?? 0,
      },
      arrival: {
        icao: flight_plan.arrival,
        iata: arrival?.iata ?? '',
        name: arrival?.name ?? '',
        lat: arrival?.lat ?? 0,
        lng: arrival?.lng ?? 0,
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
              lat: alternate?.lat ?? 0,
              lng: alternate?.lng ?? 0,
            }
          : null,
      alternate2: null,
    };
  }

  private parse(
    pilots: VatsimDataPilot[],
    airports: Map<string, Airport>,
  ): LiveFlight[] {
    if (!pilots) {
      return [];
    }

    return pilots.map((data) => ({
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
        onGround: false, // TODO: Implement this
      },
      flightPlan: this.parseVatsimFlightPlan(data.flight_plan, airports),
    }));
  }
}
