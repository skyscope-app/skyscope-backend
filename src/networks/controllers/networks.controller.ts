import { Network } from '@/networks/domain/network';
import { NetworkService } from '@/networks/domain/network-service';
import {
  LiveFlight,
  LiveFlightWithTracks,
} from '@/networks/dtos/live-flight.dto';
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
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

@Controller('networks')
@ApiTags('Networks')
export class NetworksController {
  private serviceMap: Record<Network, NetworkService>;

  constructor(
    vatsimService: VATSIMService,
    ivaoService: IVAOService,
    posconService: PosconService,
    private readonly networksService: NetworksService,
    private readonly flightsSearchService: FlightsSearchService,
  ) {
    this.serviceMap = {
      [Network.VATSIM]: vatsimService,
      [Network.IVAO]: ivaoService,
      [Network.POSCON]: posconService,
    };
  }

  @Get('/flights/:flightId')
  @ApiOkResponse({ type: () => LiveFlightWithTracks })
  private async liveFlight(@Param('flightId') flightId: string) {
    const flight = await this.flightsSearchService.findByID(flightId);

    if (!flight) {
      throw new NotFoundException();
    }

    const result = plainToInstance(LiveFlightWithTracks, flight);

    result.tracks =
      await this.flightsSearchService.fetchTracksForFlight(flightId);

    return result;
  }

  @Get('/flights')
  @ApiOkResponse({ type: () => [LiveFlight] })
  private async liveFlightsSearch(@Query('term') term: string) {
    return this.flightsSearchService.findByParams(term);
  }

  @Get(':network/flights')
  @ApiParam({ name: 'network', enum: Network })
  @ApiOkResponse({ type: [LiveFlight] })
  private async liveFlights(@Param('network') network: Network) {
    await this.networksService.fetchCurrentLive();

    const service = this.serviceMap[network];

    if (!service) {
      throw new NotImplementedException();
    }

    const flights = await service.fetchCurrentLive();

    return flights;
  }
}
