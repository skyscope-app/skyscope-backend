import { Network } from '@/networks/domain/network';
import { NetworkService } from '@/networks/domain/network-service';
import { LiveFlight, LiveFlightGeoJson } from '@/networks/dtos/live-flight.dto';
import { FlightsSearchService } from '@/networks/services/flights-search.service';
import { IVAOService } from '@/networks/services/ivao.service';
import { NetworksService } from '@/networks/services/networks.service';
import { PosconService } from '@/networks/services/poscon.service';
import { VATSIMService } from '@/networks/services/vatsim.service';
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
export class NetworksController {
  private serviceMap: Record<Network, NetworkService>;

  constructor(
    private readonly networksService: NetworksService,
    //private readonly cacheService: CacheService,
    vatsimService: VATSIMService,
    ivaoService: IVAOService,
    posconService: PosconService,
    private readonly flightsSearchService: FlightsSearchService,
  ) {
    this.serviceMap = {
      [Network.VATSIM]: vatsimService,
      [Network.IVAO]: ivaoService,
      [Network.POSCON]: posconService,
    };
  }

  @Get('/flights/:flightId')
  @ApiOkResponse({ type: () => LiveFlight })
  private async liveFlight(@Param('flightId') flightId: string) {
    const flight = await this.flightsSearchService.findByID(flightId);

    if (!flight) {
      throw new NotFoundException();
    }

    return flight;
  }

  @Get(':network/flights')
  @ApiParam({ name: 'network', enum: Network })
  @ApiOkResponse({ type: LiveFlightGeoJson })
  private async liveFlights(@Param('network') network: Network) {
    await this.networksService.fetchCurrentLive();

    const service = this.serviceMap[network];

    if (!service) {
      throw new NotImplementedException();
    }

    const flights = await service.fetchCurrentLive();

    return new LiveFlightGeoJson(flights);
  }
}
