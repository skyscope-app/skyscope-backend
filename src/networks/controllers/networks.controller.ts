import { CacheService } from '@/cache/cache.service';
import { Network } from '@/networks/domain/network';
import { NetworkService } from '@/networks/domain/network-service';
import { LiveFlight, LiveFlightGeoJson } from '@/networks/dtos/live-flight.dto';
import { IVAOService } from '@/networks/services/ivao.service';
import { PosconService } from '@/networks/services/poscon.service';
import { VATSIMService } from '@/networks/services/vatsim.service';
import { Authenticated, cacheControl } from '@/shared/utils/decorators';
import {
  Controller,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('networks')
@ApiTags('Networks')
@Authenticated()
export class NetworksController {
  private serviceMap: Record<Network, NetworkService>;

  constructor(
    vatsimService: VATSIMService,
    ivaoService: IVAOService,
    posconService: PosconService,
    private readonly cacheService: CacheService,
  ) {
    this.serviceMap = {
      [Network.VATSIM]: vatsimService,
      [Network.IVAO]: ivaoService,
      [Network.POSCON]: posconService,
    };
  }

  @Get(':network/flights/:flightId')
  @ApiParam({ name: 'network', enum: Network })
  @ApiOkResponse({ type: () => LiveFlight })
  @cacheControl.CacheControl({
    directive: cacheControl.Directive.PUBLIC,
    maxAge: 15,
  })
  private async liveFlight(
    @Param('flightId') flightId: string,
    @Param('network') network: Network,
  ) {
    const service = this.serviceMap[network];

    if (!service) {
      throw new NotImplementedException();
    }

    await service.fetchCurrentLive();

    const data = await this.cacheService.get<LiveFlight>(flightId);

    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }

  @Get(':network/flights')
  @ApiParam({ name: 'network', enum: Network })
  @ApiOkResponse({ type: LiveFlightGeoJson })
  @cacheControl.CacheControl({
    directive: cacheControl.Directive.PUBLIC,
    maxAge: 15,
  })
  private async liveFlights(@Param('network') network: Network) {
    const service = this.serviceMap[network];

    if (!service) {
      throw new NotImplementedException();
    }

    const data = await service.fetchCurrentLive();

    return new LiveFlightGeoJson(data);
  }
}
