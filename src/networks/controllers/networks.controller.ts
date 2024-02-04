import { Network } from '@/networks/domain/network';
import { LiveFlight } from '@/networks/dtos/live-flight.dto';
import { IVAOService } from '@/networks/services/ivao.service';
import { VATSIMService } from '@/networks/services/vatsim.service';
import {
  Controller,
  Get,
  NotImplementedException,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Authenticated } from '@/shared/utils/decorators';

@Controller('networks')
@ApiTags('Networks')
@Authenticated()
export class NetworksController {
  constructor(
    private readonly vatsimService: VATSIMService,
    private readonly ivaoService: IVAOService,
  ) {}

  @Get(':network/flights')
  @ApiParam({ name: 'network', enum: Network })
  @ApiOkResponse({ type: [LiveFlight] })
  private async liveFlights(
    @Param('network') network: Network,
  ): Promise<Array<LiveFlight>> {
    switch (network) {
      case Network.VATSIM:
        return this.vatsimService.fetchCurrentLive();
      case Network.IVAO:
        return this.ivaoService.fetchCurrentLive();
      default:
        throw new NotImplementedException();
    }
  }
}
