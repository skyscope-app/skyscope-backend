import { Network } from '@/networks/domain/network';
import {
  NetworkATCUseCase,
  NetworkFlightUseCase,
} from '@/networks/domain/network-flight-use-case';
import {
  LiveFlight,
  LiveFlightWithTracks,
} from '@/networks/dtos/live-flight.dto';
import { FlightsSearchService } from '@/networks/services/flights-search.service';
import { IvaoFlightsUseCase } from '@/networks/usecases/ivao-flights-usecase';
import { NetworksService } from '@/networks/services/networks.service';
import { PosconFlightsUsecase } from '@/networks/usecases/poscon-flights.usecase';
import { VatsimFlightsUsecase } from '@/networks/usecases/vatsim-flights.usecase';
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
import { LiveATC } from '@/networks/dtos/live-atc.dto';
import { IvaoATCsUseCase } from '@/networks/usecases/ivao-atcs.usecase';
import { VatsimATCsUseCase } from '@/networks/usecases/vatsim-atcs.usecase';

@Controller('networks')
@ApiTags('Networks')
export class NetworksController {
  private readonly flightMap: Record<Network, NetworkFlightUseCase>;
  private readonly atcMap: Record<Network, NetworkATCUseCase>;

  constructor(
    vatsimFlightsUseCase: VatsimFlightsUsecase,
    ivaoFlightsUseCase: IvaoFlightsUseCase,
    posconFlightsUseCase: PosconFlightsUsecase,
    ivaoATCsUseCase: IvaoATCsUseCase,
    vatsimATCsUseCase: VatsimATCsUseCase,
    private readonly networksService: NetworksService,
    private readonly flightsSearchService: FlightsSearchService,
  ) {
    this.flightMap = {
      [Network.VATSIM]: vatsimFlightsUseCase,
      [Network.IVAO]: ivaoFlightsUseCase,
      [Network.POSCON]: posconFlightsUseCase,
    };

    this.atcMap = {
      [Network.IVAO]: ivaoATCsUseCase,
      [Network.VATSIM]: vatsimATCsUseCase,
      [Network.POSCON]: ivaoATCsUseCase,
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
    await this.networksService.fetchLiveFlights();

    const service = this.flightMap[network];

    if (!service) {
      throw new NotImplementedException();
    }

    const flights = await service.fetchLiveFlights();

    return flights;
  }

  @Get(':network/atcs')
  @ApiParam({ name: 'network', enum: Network })
  @ApiOkResponse({ type: [LiveATC] })
  private async liveATCs(@Param('network') network: Network) {
    await this.networksService.fetchLiveFlights();

    const service = this.atcMap[network];

    if (!service) {
      throw new NotImplementedException();
    }

    const flights = await service.fetchLiveATCs();

    return flights;
  }
}
