import { CacheService } from '@/cache/cache.service';
import { Configuration } from '@/configurations/configuration';
import { HttpService } from '@/http/http.service';
import { NetworkATCUseCase } from '@/networks/domain/network-flight-use-case';
import { IVAOResponse } from '@/networks/dtos/ivao.dto';
import { ATCFacility, LiveATC, User } from '@/networks/dtos/live-atc.dto';
import {
  OAuth2Service,
  OAuth2TokenExchangeResponse,
} from '@/shared/services/oauth2.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IvaoATCsUseCase implements NetworkATCUseCase {
  private trackerAtc = 'https://api.ivao.aero/v2/tracker/now/atc';
  private whazzupUrl = 'https://api.ivao.aero/v2/tracker/whazzup';
  private tokenUrl = 'https://api.ivao.aero/v2/oauth/token';

  constructor(
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly oauth2Service: OAuth2Service,
    private readonly configuration: Configuration,
  ) {}

  public async fetchLiveATCs() {
    return this.cacheService.handle(
      'ivao_current_live_atcs',
      async () => {
        const token = await this.getIvaoAccessToken();

        const [trackerResponse, whazzupResponse] = await Promise.all([
          this.httpService.get<any[]>(this.trackerAtc, {
            Authorization: `Bearer ${token.access_token}`,
          }),
          this.httpService.get<IVAOResponse>(this.whazzupUrl),
        ]);

        const atcs = new Map(
          whazzupResponse.data.clients.atcs.map((atc) => [
            atc.callsign as string,
            atc,
          ]),
        );

        return trackerResponse.data.map((atc) =>
          this.parse(atc, atcs.get(atc.callsign)),
        );
      },
      15,
    );
  }

  private async getIvaoAccessToken() {
    const cachedData = await this.cacheService.get<OAuth2TokenExchangeResponse>(
      'ivao-server-access-token',
    );

    if (cachedData) {
      return cachedData;
    }

    const clientId = this.configuration.IVAO_CLIENT_ID;
    const clientSecret = this.configuration.IVAO_CLIENT_SECRET;

    const token = await this.oauth2Service.clientCredentials(
      this.tokenUrl,
      clientId,
      clientSecret,
    );

    await this.cacheService.set(
      'ivao-server-access-token',
      token.data,
      token.data.expires_in,
    );

    return token.data;
  }

  getFacility(atc: any) {
    switch (atc.atcSession.position) {
      case 'FSS':
        return ATCFacility.FSS;
      case 'DEL':
        return ATCFacility.DEL;
      case 'GND':
        return ATCFacility.GND;
      case 'TWR':
        return ATCFacility.TWR;
      case 'APP':
        return ATCFacility.APP;
      case 'CTR':
        return ATCFacility.CTR;
      case 'DEP':
        return ATCFacility.DEP;
      default:
        return ATCFacility.UNKNOWN;
    }
  }

  private parse(atc: any, whazzupAtc: any) {
    const name =
      ((atc.user.firstName ?? '') + ' ' + (atc.user.lastName ?? '')).trim() ||
      null;

    const atcUser = new User(
      String(atc.userId),
      atc.user.rating.atcRatingId as number,
      name,
    );

    const facility = this.getFacility(atc);

    const frequency = String(whazzupAtc?.atcSession.frequency).includes('.')
      ? String(whazzupAtc?.atcSession.frequency)
      : String(whazzupAtc?.atcSession.frequency) + '.0';

    return new LiveATC(
      'ivao',
      atc.callsign,
      String(atc.user.rating.atcRatingId),
      atcUser,
      atc.createdAt,
      whazzupAtc.atis?.lines ?? [],
      String(frequency).padEnd(7, '0'),
      Number(whazzupAtc?.lastTrack?.latitude ?? 0),
      Number(whazzupAtc?.lastTrack?.longitude ?? 0),
      facility,
      (atc?.atcPosition?.regionMap ?? []).map((point) => [
        point.lat,
        point.lng,
      ]),
    );
  }
}
