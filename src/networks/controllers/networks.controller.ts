import { Network } from '@/networks/domain/network';
import { LiveFlight } from '@/networks/dtos/live-flight.dto';
import { VATSIMService } from '@/networks/services/vatsim.service';
import {
  Controller,
  Get,
  NotImplementedException,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('networks')
@ApiTags('Networks')
export class NetworksController {
  constructor(private readonly vatsimService: VATSIMService) {}

  @Get(':network/flights')
  @ApiParam({ name: 'network', enum: Network })
  @ApiOkResponse({ type: [LiveFlight] })
  private async liveFlights(
    @Param('network') network: Network,
  ): Promise<Array<LiveFlight>> {
    switch (network) {
      case Network.VATSIM:
        return this.vatsimService.fetchCurrentLive();
      default:
        throw new NotImplementedException();
    }
  }
}
