import { Airport } from '@/airports/airports.entity';
import { AirportsService } from '@/airports/airports.service';
import { CacheService } from '@/cache/cache.service';
import { IvaoPilot, IVAOResponse } from '@/networks/dtos/ivao.dto';
import { Aircraft, LiveFlight } from '@/networks/dtos/live-flight.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { v4, v5 } from 'uuid';

@Injectable()
export class IVAOService {
  public readonly axios: AxiosInstance;
  private url = 'https://api.ivao.aero/v2/tracker/whazzup';

  constructor(
    private readonly airportsService: AirportsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly cacheService: CacheService,
  ) {
    this.axios = axios.create({});
  }

  public async fetchCurrentLive() {
    return this.cacheService.handle(
      'ivao_flights',
      async () => {
        const [{ data }, airports] = await Promise.all([
          this.axios.get<IVAOResponse>(this.url),
          this.airportsService.getAirportsMap(),
        ]);

        const flights = this.parse(data.clients.pilots, airports);

        await Promise.all(
          flights.map((flight) => {
            return this.cacheManager.set(flight.id, flight, 15 * 1000);
          }),
        );

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
            .update(`${pilot.flightPlan?.id ?? v4()}`)
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
          coordinates: [
            pilot.lastTrack?.longitude ?? departure?.lng ?? 0,
            pilot.lastTrack?.latitude ?? departure?.lat ?? 0,
          ],
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
            coordinates: [departure?.lat ?? 0, departure?.lng ?? 0],
          },
          arrival: {
            icao: arrival?.icao ?? '',
            iata: arrival?.iata ?? '',
            name: arrival?.name ?? '',
            coordinates: [arrival?.lat ?? 0, arrival?.lng ?? 0],
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
          departureTime: String(
            pilot.flightPlan?.departureTime ?? 0 / 60,
          ).padStart(4, '0'),
          enrouteTime: String(pilot.flightPlan?.eet ?? 0 / 60).padStart(4, '0'),
          endurance: String(pilot.flightPlan?.endurance ?? 0 / 60).padStart(
            4,
            '0',
          ),
          alternate:
            pilot.flightPlan?.alternativeId !== null
              ? {
                  icao: alternate?.icao ?? '',
                  iata: alternate?.iata ?? '',
                  name: alternate?.name ?? '',
                  coordinates: [alternate?.lat ?? 0, alternate?.lng ?? 0],
                }
              : null,
          alternate2:
            pilot.flightPlan?.alternative2Id !== null
              ? {
                  icao: alternate2?.icao ?? '',
                  iata: alternate2?.iata ?? '',
                  name: alternate2?.name ?? '',
                  coordinates: [alternate2?.lat ?? 0, alternate2?.lng ?? 0],
                }
              : null,
        },
      };
    });
  }
}