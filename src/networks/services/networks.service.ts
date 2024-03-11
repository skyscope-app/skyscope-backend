import { NetworkService } from '@/networks/domain/network-service';
import { LiveFlight } from '@/networks/dtos/live-flight.dto';
import { IVAOService } from '@/networks/services/ivao.service';
import { VATSIMService } from '@/networks/services/vatsim.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class NetworksService implements NetworkService {
  constructor(
    private readonly vatsimService: VATSIMService,
    private readonly ivaoService: IVAOService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async fetchCurrentLive(): Promise<LiveFlight[]> {
    const [ivao, vatsim] = await Promise.all([
      this.ivaoService.fetchCurrentLive(),
      this.vatsimService.fetchCurrentLive(),
    ]);

    return [...ivao, ...vatsim];
  }
}
