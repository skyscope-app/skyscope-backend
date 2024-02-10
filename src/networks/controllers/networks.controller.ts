import { Network } from '@/networks/domain/network';
import { LiveFlight } from '@/networks/dtos/live-flight.dto';
import { IVAOService } from '@/networks/services/ivao.service';
import { VATSIMService } from '@/networks/services/vatsim.service';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Authenticated, cacheControl } from '@/shared/utils/decorators';
import { CacheService } from '@/cache/cache.service';
import { NetworkService } from '@/networks/domain/network-service';
import { PosconService } from '@/networks/services/poscon.service';
import { point } from '@turf/helpers';

@Controller('networks')
@ApiTags('Networks')
@Authenticated()
export class NetworksController {
  private serviceMap: Record<Network, NetworkService>;

  constructor(
    private readonly vatsimService: VATSIMService,
    private readonly ivaoService: IVAOService,
    private readonly posconService: PosconService,
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
    await this.serviceMap[network].fetchCurrentLive();

    const data = await this.cacheService.get<LiveFlight>(flightId);

    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }

  @Get(':network/flights')
  @ApiParam({ name: 'network', enum: Network })
  @ApiOkResponse({ type: [LiveFlight] })
  @cacheControl.CacheControl({
    directive: cacheControl.Directive.PUBLIC,
    maxAge: 15,
  })
  private async liveFlights(@Param('network') network: Network) {
    const data = await this.serviceMap[network].fetchCurrentLive();

    const features = data.map((flight) =>
      point(flight.position.coordinates, flight),
    );

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
