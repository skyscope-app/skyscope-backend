import { Airport } from '@/airports/airports.entity';
import { AirportsService } from '@/airports/airports.service';
import { CacheService } from '@/cache/cache.service';
import { HttpService } from '@/http/http.service';
import { IVAOResponse, IvaoPilot } from '@/networks/dtos/ivao.dto';
import { Aircraft, LiveFlight } from '@/networks/dtos/live-flight.dto';
import { parseSecondsToHours } from '@/shared/utils/time';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { v5 } from 'uuid';

@Injectable()
export class IVAOService {
  private url = 'https://api.ivao.aero/v2/tracker/whazzup';

  constructor(
    private readonly airportsService: AirportsService,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {}

  public async fetchCurrentLive() {
    return this.cacheService.handle(
      'ivao_current_live',
      async () => {
        const [{ data }, airports] = await Promise.all([
          this.httpService.get<IVAOResponse>(this.url),
          this.airportsService.getAirportsMap(),
        ]);

        const flights = this.parse(data.clients.pilots, airports);

        return flights;
      },
      15,
    );
  }

  private parse(
    pilots: IvaoPilot[],
    airports: Map<string, Airport>,
  ): LiveFlight[] {
    return pilots.map((pilot): LiveFlight => {
      const departure = airports.get(pilot.flightPlan?.departureId ?? '');
      const arrival = airports.get(pilot.flightPlan?.arrivalId ?? '');
      const alternate = airports.get(pilot.flightPlan?.alternativeId ?? '');
      const alternate2 = airports.get(pilot.flightPlan?.alternative2Id ?? '');

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
          lat: pilot.lastTrack?.latitude ?? departure?.lng ?? 0,
          lng: pilot.lastTrack?.longitude ?? departure?.lat ?? 0,
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
            lat: departure?.lat ?? 0,
            lng: departure?.lng ?? 0,
          },
          arrival: {
            icao: arrival?.icao ?? '',
            iata: arrival?.iata ?? '',
            name: arrival?.name ?? '',
            lat: arrival?.lat ?? 0,
            lng: arrival?.lng ?? 0,
          },
          aircraft: new Aircraft({
            icao: pilot.flightPlan?.aircraft?.icaoCode ?? '',
            wakeTurbulence: pilot.flightPlan?.aircraft?.wakeTurbulence ?? '',
            registration:
              ((pilot.flightPlan?.remarks ?? '').match(/REG\/(\w+)/) ||
                [])[1] || '',
            transponderTypes: pilot.flightPlan?.aircraftTransponderTypes ?? '',
            equipment: pilot.flightPlan?.aircraft?.icaoCode ?? '',
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
                  lat: alternate?.lat ?? 0,
                  lng: alternate?.lng ?? 0,
                }
              : null,
          alternate2:
            pilot.flightPlan?.alternative2Id !== null
              ? {
                  icao: alternate2?.icao ?? '',
                  iata: alternate2?.iata ?? '',
                  name: alternate2?.name ?? '',
                  lat: alternate2?.lat ?? 0,
                  lng: alternate2?.lng ?? 0,
                }
              : null,
        },
      };
    });
  }
}
