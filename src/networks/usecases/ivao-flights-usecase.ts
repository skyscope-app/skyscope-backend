import { Airline } from '@/airlines/domain/airline';
import { AirlinesService } from '@/airlines/services/airlines.service';
import { AirportsService } from '@/airports/airports.service';
import { Airport } from '@/airports/domain/airports.entity';
import { CacheService } from '@/cache/cache.service';
import { HttpService } from '@/http/http.service';
import { IvaoPilot, IVAOResponse } from '@/networks/dtos/ivao.dto';
import {
  Aircraft,
  AirlineResponse,
  LiveFlight,
} from '@/networks/dtos/live-flight.dto';
import { parseSecondsToHours } from '@/shared/utils/time';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { v5 } from 'uuid';

@Injectable()
export class IvaoFlightsUseCase {
  private url = 'https://api.ivao.aero/v2/tracker/whazzup';

  constructor(
    private readonly airportsService: AirportsService,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly airlinesService: AirlinesService,
  ) {}

  public async fetchLiveFlights() {
    return this.cacheService.handle(
      'ivao_current_live_flights',
      async () => {
        const [{ data }, airports, airlines] = await Promise.all([
          this.httpService.get<IVAOResponse>(this.url),
          this.airportsService.getAirportsMap(),
          this.airlinesService.list(),
        ]);

        const airlinesByIcao = new Map(
          airlines.map((airline) => [airline.icao, airline]),
        );

        const flights = this.parse(
          data.clients.pilots,
          airports,
          airlinesByIcao,
        );

        return flights;
      },
      15,
    );
  }

  private parse(
    pilots: IvaoPilot[],
    airports: Map<string, Airport>,
    airlinesByIcao: Map<string, Airline>,
  ): LiveFlight[] {
    return pilots.map((pilot): LiveFlight => {
      const departure = airports.get(pilot.flightPlan?.departureId ?? '');
      const arrival = airports.get(pilot.flightPlan?.arrivalId ?? '');
      const alternate = airports.get(pilot.flightPlan?.alternativeId ?? '');
      const alternate2 = airports.get(pilot.flightPlan?.alternative2Id ?? '');
      const airline = airlinesByIcao.get(pilot.callsign.slice(0, 3));

      return {
        id: v5(
          crypto
            .createHash('md5')
            .update(
              `${pilot.userId}${pilot.callsign}${pilot.flightPlan?.departureId}${pilot.flightPlan?.arrivalId}${pilot.flightPlan?.actualDepartureTime}`,
            )
            .digest('hex'),
          '820aabf8-e662-4075-8e9f-8a94dc1f5148',
        ),
        pilot: {
          id: pilot.userId,
          name: '',
          rating: String(pilot.rating),
        },
        callsign: pilot.callsign,
        network: 'ivao',
        position: {
          altitude: pilot.lastTrack?.altitude ?? 0,
          lat: pilot.lastTrack?.latitude ?? departure?.longitude ?? 0,
          lng: pilot.lastTrack?.longitude ?? departure?.latitude ?? 0,
          groundSpeed: pilot.lastTrack?.groundSpeed ?? 0,
          heading: pilot.lastTrack?.heading ?? 0,
          onGround: pilot.lastTrack?.onGround ?? true,
          transponder: String(pilot.lastTrack?.transponder).padStart(4, '0'),
        },
        flightPlan: {
          flightRules: pilot.flightPlan?.flightRules ?? '',
          flightType: pilot.flightPlan?.flightType ?? '',
          departure: {
            icao: departure?.icao ?? '',
            iata: departure?.iata ?? '',
            name: departure?.name ?? '',
            lat: departure?.latitude ?? 0,
            lng: departure?.longitude ?? 0,
          },
          arrival: {
            icao: arrival?.icao ?? '',
            iata: arrival?.iata ?? '',
            name: arrival?.name ?? '',
            lat: arrival?.latitude ?? 0,
            lng: arrival?.longitude ?? 0,
          },
          aircraft: new Aircraft({
            icao: pilot.flightPlan?.aircraft?.icaoCode ?? '',
            wakeTurbulence: pilot.flightPlan?.aircraft?.wakeTurbulence ?? '',
            registration:
              ((pilot.flightPlan?.remarks ?? '').match(/REG\/(\w+)/) ||
                [])[1] || '',
            transponderTypes: pilot.flightPlan?.aircraftTransponderTypes ?? '',
            equipment: pilot.flightPlan?.aircraftEquipments ?? '',
          } as Aircraft),
          level: Number((pilot.flightPlan?.level ?? '').slice(1)) * 100,
          route: pilot.flightPlan?.route ?? '',
          remarks: pilot.flightPlan?.remarks ?? '',
          cruiseTas: (pilot.flightPlan?.speed ?? '').slice(1) ?? '',
          departureTime: parseSecondsToHours(
            pilot.flightPlan?.departureTime ?? 0,
          ),

          enrouteTime: parseSecondsToHours(pilot.flightPlan?.eet ?? 0),
          endurance: parseSecondsToHours(pilot.flightPlan?.endurance ?? 0),
          alternate:
            pilot.flightPlan?.alternativeId !== null
              ? {
                  icao: alternate?.icao ?? '',
                  iata: alternate?.iata ?? '',
                  name: alternate?.name ?? '',
                  lat: alternate?.latitude ?? 0,
                  lng: alternate?.longitude ?? 0,
                }
              : null,
          alternate2:
            pilot.flightPlan?.alternative2Id !== null
              ? {
                  icao: alternate2?.icao ?? '',
                  iata: alternate2?.iata ?? '',
                  name: alternate2?.name ?? '',
                  lat: alternate2?.latitude ?? 0,
                  lng: alternate2?.longitude ?? 0,
                }
              : null,
        },
        airline: airline ? new AirlineResponse(airline) : null,
      };
    });
  }
}
