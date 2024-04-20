import { AirportsService } from '@/airports/airports.service';
import { Airport } from '@/airports/domain/airports.entity';
import { CacheService } from '@/cache/cache.service';
import { HttpService } from '@/http/http.service';
import { NetworkATCUseCase } from '@/networks/domain/network-flight-use-case';
import { ATCFacility, LiveATC, User } from '@/networks/dtos/live-atc.dto';
import { VatsimData, VatsimDataController } from '@/networks/dtos/vatsim.dto';
import { VatSpyData } from '@/networks/dtos/vatspy.dto';
import { VatSpyService } from '@/networks/services/vatspy.service';
import { Injectable } from '@nestjs/common';
import { FeatureCollection } from 'geojson';

@Injectable()
export class VatsimATCsUseCase implements NetworkATCUseCase {
  private url = 'https://data.vatsim.net/v3/vatsim-data.json';
  private traconBoundaries =
    'https://map.vatsim.net/livedata/traconboundaries.json';

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
        const [vatsimResponse, airports, traconBoundaries] = await Promise.all([
          this.httpService.get<VatsimData>(this.url),
          this.airports.getAirportsMap(),
          this.fetchTraconsBoundaries(),
        ]);

        return vatsimResponse.data.controllers
          .filter((atc) => atc.facility > 0)
          .map((atc) => this.parse(atc, airports, data, traconBoundaries.data));
      },
      15,
    );
  }
  async fetchTraconsBoundaries() {
    return this.cacheService.handle(
      'vatsim-tracon-boundaries',
      async () => {
        return this.httpService.get<FeatureCollection>(this.traconBoundaries);
      },
      60 * 60,
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
        if (atc.callsign.endsWith('R_TWR')) {
          return ATCFacility.AFIS;
        }
        return ATCFacility.TWR;
      case 5:
        return ATCFacility.APP;
      case 6:
        return ATCFacility.CTR;
      default:
        return ATCFacility.UNKNOWN;
    }
  }

  private async loadTraconBoundaries() {
    return this.httpService
      .get<ATCFacility[]>(this.traconBoundaries)
      .then((r) => r.data);
  }

  private parse(
    atc: VatsimDataController,
    airports: Map<string, Airport>,
    vatspyData: VatSpyData,
    tmaBoundaries: FeatureCollection,
  ) {
    const atcUser = new User(String(atc.cid), atc.rating as number, atc.name);
    const facility = this.getFacility(atc);

    const { latitude, longitude, points } = this.getGeometry(
      facility,
      vatspyData,
      atc,
      airports,
      tmaBoundaries,
    );

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

  private getGeometry(
    facility: ATCFacility,
    vatspyData: VatSpyData,
    atc: VatsimDataController,
    airports: Map<string, Airport>,
    tmaBoundaries: FeatureCollection,
  ) {
    switch (facility) {
      case ATCFacility.FSS:
      case ATCFacility.CTR:
        return this.extractGeometryFromCtr(facility, vatspyData, atc);
      case ATCFacility.APP:
      case ATCFacility.DEP:
        return this.extractGeometryFromApp(
          facility,
          vatspyData,
          atc,
          airports,
          tmaBoundaries,
        );
      case ATCFacility.DEL:
      case ATCFacility.GND:
      case ATCFacility.TWR:
        return this.extractGeometryFromAirport(atc, airports);
      default:
        return {
          latitude: 0,
          longitude: 0,
          points: [],
        };
    }
  }
  private extractGeometryFromAirport(
    atc: VatsimDataController,
    airports: Map<string, Airport>,
  ) {
    const suffix = atc.callsign.split('_')[0].padStart(4, 'K');

    const airport = airports.get(suffix);

    if (!airport) {
      return {
        latitude: 0,
        longitude: 0,
        points: [],
      };
    }

    return {
      latitude: Number(airport.latitude),
      longitude: Number(airport.longitude),
      points: [],
    };
  }

  private extractGeometryFromApp(
    facility: ATCFacility,
    vatspyData: VatSpyData,
    atc: VatsimDataController,
    airports: Map<string, Airport>,
    tmaBoundaries: FeatureCollection,
  ) {
    const features = new Map(
      tmaBoundaries.features.map((feature) => [
        (feature.properties?.id as string) ?? '',
        feature,
      ]),
    );

    const suffix = atc.callsign.split('_')[0];

    let feature = features.get(suffix);

    if (!feature) {
      feature = tmaBoundaries.features.find((feature) =>
        feature.properties?.prefix.includes(suffix),
      );
    }

    if (!feature) {
      return {
        latitude: 0,
        longitude: 0,
        points: [],
      };
    }

    return {
      latitude: 0,
      longitude: 0,
      points: (feature.geometry as any).coordinates[0][0],
    };
  }

  private extractGeometryFromCtr(
    facility: ATCFacility,
    vatspyData: VatSpyData,
    atc: VatsimDataController,
  ) {
    const { firs, boundaries } = vatspyData;

    const suffix = atc.callsign.replace(`_${facility}`, '');

    const fir = firs.find(
      (fir) =>
        fir.callsign_prefix === suffix.split('_')[0] ||
        fir.icao === suffix.split('_')[0],
    );

    if (!fir) {
      return {
        latitude: 0,
        longitude: 0,
        points: [],
      };
    }

    const boundary = boundaries[fir.icao];

    if (!boundary) {
      return {
        latitude: 0,
        longitude: 0,
        points: [],
      };
    }

    return {
      latitude: boundary.latitude,
      longitude: boundary.longitude,
      points: boundary.points,
    };
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
      latitude: Number(airport.latitude),
      longitude: Number(airport.longitude),
    };
  }
}
