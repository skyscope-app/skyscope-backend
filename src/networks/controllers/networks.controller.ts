import { NavigraphParseRouteUseCase } from '@/navigraph/usecase/parse-route.usecase';
import { Network } from '@/networks/domain/network';
import { LiveATC } from '@/networks/dtos/live-atc.dto';
import {
  LiveFlight,
  LiveFlightWithTracks,
  ReducedLiveFlight,
} from '@/networks/dtos/live-flight.dto';
import { FlightsSearchService } from '@/networks/services/flights-search.service';
import { NetworksService } from '@/networks/services/networks.service';
import { FeatureFlagService } from '@/shared/services/feature-flag.service';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('networks')
@ApiTags('Networks')
export class NetworksController {
  constructor(
    private readonly networksService: NetworksService,
    private readonly flightsSearchService: FlightsSearchService,
    private readonly navigraphParseRouteUseCase: NavigraphParseRouteUseCase,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  @Get('/flights/:flightId')
  @ApiOkResponse({ type: () => LiveFlightWithTracks })
  @ApiParam({ name: 'flightId', type: String, description: 'Flight UUID' })
  private async liveFlight(@Param('flightId') flightId: string) {
    const flight = await this.networksService.findFlightById(flightId);

    if (!flight) {
      throw new NotFoundException();
    }

    // if (flight.flightPlan) {
    //   try {
    //     flight.route = await this.navigraphParseRouteUseCase.run(
    //       `${flight.flightPlan.departure.icao} ${flight.flightPlan.route} ${flight.flightPlan?.arrival.icao}`,
    //     );
    //   } catch {}
    // }

    return flight;
  }

  @Get('/flights')
  @ApiOkResponse({ type: () => [LiveFlight] })
  private async liveFlightsSearch(@Query('term') term: string) {
    return this.flightsSearchService.searchFlight(term);
  }

  @Get(':network/flights')
  @ApiParam({ name: 'network', enum: Network })
  @ApiOkResponse({ type: [LiveFlight] })
  private async liveFlights(@Param('network') network: Network) {
    const reducePayloadActivated = await this.featureFlagService.findById(
      'network_flight_reduced_payload',
      true,
    );

    const flights = await this.networksService.findFlightsByNetwork(network);

    if (reducePayloadActivated) {
      return flights.map((flight) => new ReducedLiveFlight(flight));
    }

    return flights;
  }

  @Get('/atcs/:atcId')
  @ApiParam({ name: 'atcId', type: String, description: 'ATC UUID' })
  @ApiOkResponse({ type: [LiveATC] })
  private async findAtc(@Param('atcId') atcId: string) {
    const atc = await this.networksService.findATCById(atcId);

    if (!atc) {
      throw new NotFoundException();
    }

    return atc;
  }

  @Get(':network/atcs')
  @ApiParam({ name: 'network', enum: Network })
  @ApiOkResponse({ type: [LiveATC] })
  private async liveATCs(@Param('network') network: Network) {
    const atcs = await this.networksService.findATCsByNetwork(network);

    return atcs;
  }
}
