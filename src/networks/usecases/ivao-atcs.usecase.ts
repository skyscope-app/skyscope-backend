import { CacheService } from '@/cache/cache.service';
import { HttpService } from '@/http/http.service';
import { NetworkATCUseCase } from '@/networks/domain/network-flight-use-case';
import { IVAOResponse } from '@/networks/dtos/ivao.dto';
import { ATCFacility, LiveATC, User } from '@/networks/dtos/live-atc.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IvaoATCsUseCase implements NetworkATCUseCase {
  private url = 'https://api.ivao.aero/v2/tracker/whazzup';

  constructor(
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {}

  public async fetchLiveATCs() {
    return this.cacheService.handle(
      'ivao_current_live_atcs',
      async () => {
        const [ivaoResponse] = await Promise.all([
          this.httpService.get<IVAOResponse>(this.url),
        ]);

        return ivaoResponse.data.clients.atcs.map((atc) => this.parse(atc));
      },
      15,
    );
  }

  private parse(atc: any) {
    const atcUser = new User(String(atc.userId), atc.rating as number, null);
    const facility = this.getFacility(atc);

    return new LiveATC(
      'ivao',
      atc.callsign,
      String(atc.rating),
      atcUser,
      atc.createdAt,
      atc.atis.lines,
      String(atc.atcSession.frequency).padEnd(7, '0'),
      Number(atc.lastTrack?.latitude ?? 0),
      Number(atc.lastTrack?.longitude ?? 0),
      facility,
      [],
    );
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
        return ATCFacility.UNKNOW;
    }
  }
}
