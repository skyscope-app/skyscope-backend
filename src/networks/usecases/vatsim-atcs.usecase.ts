import { Airport } from '@/airports/airports.entity';
import { AirportsService } from '@/airports/airports.service';
import { CacheService } from '@/cache/cache.service';
import { HttpService } from '@/http/http.service';
import { NetworkATCUseCase } from '@/networks/domain/network-flight-use-case';
import { ATCFacility, LiveATC, User } from '@/networks/dtos/live-atc.dto';
import { VatsimData, VatsimDataController } from '@/networks/dtos/vatsim.dto';
import { VatSpyData } from '@/networks/dtos/vatspy.dto';
import { VatSpyService } from '@/networks/services/vatspy.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VatsimATCsUseCase implements NetworkATCUseCase {
  private url = 'https://data.vatsim.net/v3/vatsim-data.json';

  constructor(
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly airports: AirportsService,
    private readonly vatspy: VatSpyService,
  ) {}

  public async fetchLiveATCs() {
    const data = await this.vatspy.loadData();

    return this.cacheService.handle(
      'vatsim_current_live_atcs',
      async () => {
        const [vatsimResponse, airports] = await Promise.all([
          this.httpService.get<VatsimData>(this.url),
          this.airports.getAirportsMap(),
        ]);

        return vatsimResponse.data.controllers
          .filter((atc) => atc.facility > 0)
          .map((atc) => this.parse(atc, airports, data));
      },
      15,
    );
  }

  private parse(
    atc: VatsimDataController,
    airports: Map<string, Airport>,
    vatspyData: VatSpyData,
  ) {
    const atcUser = new User(String(atc.cid), atc.rating as number, atc.name);
    const facility = this.getFacility(atc);

    let points: [number, number][] = [];
    let latitude = 0;
    let longitude = 0;

    if ([ATCFacility.CTR, ATCFacility.FSS].includes(facility)) {
      const { firs, boundaries } = vatspyData;

      const suffix = atc.callsign.replace(`_${facility}`, '');

      const fir = firs.find(
        (fir) =>
          fir.callsign_prefix === suffix.split('_')[0] ||
          fir.icao === suffix.split('_')[0],
      );

      if (fir) {
        const boundary = boundaries[fir.icao];

        if (boundary) {
          points = boundary.points;
          latitude = boundary.latitude;
          longitude = boundary.longitude;
        }
      }
    }

    if (latitude === 0 && longitude === 0) {
      const data = this.getLatAndLon(atc, airports);
      latitude = data.latitude;
      longitude = data.longitude;
    }

    return new LiveATC(
      'vatsim',
      atc.callsign,
      String(atc.rating),
      atcUser,
      atc.logon_time,
      atc.text_atis ?? [],
      String(atc.frequency).padEnd(7, '0'),
      latitude,
      longitude,
      facility,
      points,
    );
  }

  getFacility(atc: VatsimDataController) {
    switch (atc.facility) {
      case 1:
        return ATCFacility.FSS;
      case 2:
        return ATCFacility.DEL;
      case 3:
        return ATCFacility.GND;
      case 4:
        return ATCFacility.TWR;
      case 5:
        return ATCFacility.APP;
      case 6:
        return ATCFacility.CTR;
      default:
        return ATCFacility.UNKNOW;
    }
  }

  private getLatAndLon(
    atc: VatsimDataController,
    airports: Map<string, Airport>,
  ) {
    if (atc.facility < 1 && atc.facility > 4) {
      return {
        latitude: 0,
        longitude: 0,
      };
    }

    const icao = atc.callsign.slice(0, 4);
    const airport = airports.get(icao);

    if (!airport) {
      return {
        latitude: 0,
        longitude: 0,
      };
    }

    return {
      latitude: Number(airport.lat),
      longitude: Number(airport.lng),
    };
  }
}
