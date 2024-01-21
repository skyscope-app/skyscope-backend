import { HttpService } from '@/http/http.service';
import { FlightPlan, LiveFlight } from '@/networks/dtos/live-flight.dto';
import {
  VatsimData,
  VatsimDataFlightPlan,
  VatsimDataPilot,
} from '@/networks/dtos/vatsim.dto';
import { Optional } from '@/shared/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VATSIMService {
  private url = 'https://data.vatsim.net/v3/vatsim-data.json';

  constructor(private readonly httpService: HttpService) {}

  public async fetchCurrentLive(): Promise<Array<LiveFlight>> {
    const { data } = await this.httpService.get<VatsimData>(this.url);

    return this.parse(data.pilots);
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
  ): Optional<FlightPlan> {
    if (!flight_plan) {
      return null;
    }

    return {
      flightRules: flight_plan.flight_rules,
      flightType: 'S', // TODO: Review this
      departure: {
        icao: flight_plan.departure,
        iata: 'FIX', // TODO: Review this
        name: 'FIX', // TODO: Review this
        coordinates: [0, 0], // TODO: Review this
      },
      arrival: {
        icao: flight_plan.arrival,
        iata: 'FIX', // TODO: Review this
        name: 'FIX', // TODO: Review this
        coordinates: [0, 0], // TODO: Review this
      },
      aircraft: {
        icao: flight_plan.aircraft_short,
        wakeTurbulence: this.parseVatsimAircraftWakeTurbulence(
          flight_plan.aircraft,
        ),
        registration: 'PR-RUY', // TODO: Look this up in remarks (/REG=)
        transponderTypes: this.parseVatsimAircraftTransponderEquipmentCode(
          flight_plan.aircraft,
        ),
        equipment: this.parseVatsimAircraftEquipment(flight_plan.aircraft),
      },
      level: flight_plan.altitude, // TODO: Parse this to FlightLevel or Altitude
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
              iata: 'FIX', // TODO: Review this
              name: 'FIX', // TODO: Review this
              coordinates: [0, 0], // TODO: Review this
            }
          : null,
      alternate2: null,
    };
  }

  private parse(pilots: VatsimDataPilot[]): LiveFlight[] {
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
      flightPlan: this.parseVatsimFlightPlan(data.flight_plan),
    }));
  }
}
