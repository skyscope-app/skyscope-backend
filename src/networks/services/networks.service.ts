import { AirportsService } from '@/airports/airports.service';
import { Network, NetworkAirportFlights } from '@/networks/domain/network';
import {
  NetworkATCUseCase,
  NetworkFlightUseCase,
} from '@/networks/domain/network-flight-use-case';
import { LiveATC } from '@/networks/dtos/live-atc.dto';
import { LiveFlight } from '@/networks/dtos/live-flight.dto';
import { IvaoATCsUseCase } from '@/networks/usecases/ivao-atcs.usecase';
import { IvaoFlightsUseCase } from '@/networks/usecases/ivao-flights-usecase';
import { VatsimATCsUseCase } from '@/networks/usecases/vatsim-atcs.usecase';
import { VatsimFlightsUsecase } from '@/networks/usecases/vatsim-flights.usecase';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NetworksService
  implements NetworkFlightUseCase, NetworkATCUseCase
{
  constructor(
    private readonly vatsimFlightsUseCase: VatsimFlightsUsecase,
    private readonly ivaoFlightsUseCase: IvaoFlightsUseCase,
    private readonly ivaoATCsUseCase: IvaoATCsUseCase,
    private readonly vatsimATCsUseCase: VatsimATCsUseCase,
    private readonly airportsService: AirportsService,
  ) {}

  async fetchLiveFlights(): Promise<LiveFlight[]> {
    const [ivao, vatsim, airports] = await Promise.all([
      this.ivaoFlightsUseCase.fetchLiveFlights(),
      this.vatsimFlightsUseCase.fetchLiveFlights(),
      this.airportsService.getAirportsMap(),
    ]);

    return [...ivao, ...vatsim].map((f) => {
      f.enrichAirports(airports);
      return f;
    });
  }

  async fetchLiveATCs(): Promise<LiveATC[]> {
    const [ivao, vatsim] = await Promise.all([
      this.ivaoATCsUseCase.fetchLiveATCs(),
      this.vatsimATCsUseCase.fetchLiveATCs(),
    ]);

    return [...ivao, ...vatsim];
  }

  async fetchAirportFlights(
    icao: string,
  ): Promise<Map<Network, NetworkAirportFlights>> {
    const flights = await this.fetchLiveFlights();

    return new Map<Network, NetworkAirportFlights>(
      [Network.IVAO, Network.VATSIM].map((network) => [
        network,
        {
          arrival: flights.filter(
            (flight) =>
              (flight.flightPlan?.arrival.icao ?? '') === icao &&
              flight.network === network,
          ),
          departure: flights.filter(
            (flight) =>
              (flight.flightPlan?.departure.icao ?? '') === icao &&
              flight.network === network,
          ),
        },
      ]),
    );
  }
}
