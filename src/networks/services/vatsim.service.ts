import { FlightPlan, LiveFlight } from '@/networks/dtos/live-flight.dto';
import {
  VatsimData,
  VatsimDataFlightPlan,
  VatsimDataPilot,
} from '@/networks/dtos/vatsim.dto';
import { Optional } from '@/shared/types';
import { Injectable } from '@nestjs/common';
import { AirportsService } from '@/airports/airports.service';
import { Airport } from '@/airports/airports.entity';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class VATSIMService {
  public readonly axios: AxiosInstance;
  private url = 'https://data.vatsim.net/v3/vatsim-data.json';

  constructor(private readonly airportsService: AirportsService) {
    this.axios = axios.create({});
  }

  public async fetchCurrentLive(): Promise<Array<LiveFlight>> {
    const [{ data }, airports] = await Promise.all([
      this.axios.get<VatsimData>(this.url),
      this.airportsService.getAirportsMap(),
    ]);

    return this.parse(data.pilots, airports);
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
    flight_plan: Optional<VatsimDataFlightPlan>,
    airports: Map<string, Airport>,
  ): Optional<FlightPlan> {
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
        coordinates: [departure?.lat ?? 0, departure?.lng ?? 0],
      },
      arrival: {
        icao: flight_plan.arrival,
        iata: arrival?.iata ?? '',
        name: arrival?.name ?? '',
        coordinates: [arrival?.lat ?? 0, arrival?.lng ?? 0],
      },
      aircraft: {
        icao: flight_plan.aircraft_short,
        wakeTurbulence: this.parseVatsimAircraftWakeTurbulence(
          flight_plan.aircraft,
        ),
        registration: (flight_plan.remarks.match(/REG\/(\w+)/) || [])[1] || '',
        transponderTypes: this.parseVatsimAircraftTransponderEquipmentCode(
          flight_plan.aircraft,
        ),
        equipment: this.parseVatsimAircraftEquipment(flight_plan.aircraft),
      },
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
              coordinates: [alternate?.lat ?? 0, alternate?.lng ?? 0],
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
      id: `vatsim-${data.callsign}`,
      network: 'vatsim',
      callsign: data.callsign,
      pilot: {
        id: data.cid,
        rating: '',
        name: data.name,
      },
      position: {
        coordinates: [data.longitude, data.latitude],
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
