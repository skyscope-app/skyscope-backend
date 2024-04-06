import { NetworkFlightUseCase } from '@/networks/domain/network-flight-use-case';
import { LiveFlight } from '@/networks/dtos/live-flight.dto';
import { IvaoFlightsUseCase } from '@/networks/usecases/ivao-flights-usecase';
import { VatsimFlightsUsecase } from '@/networks/usecases/vatsim-flights.usecase';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class NetworksService implements NetworkFlightUseCase {
  constructor(
    private readonly vatsimFlightsUseCase: VatsimFlightsUsecase,
    private readonly ivaoFlightsUseCase: IvaoFlightsUseCase,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async fetchLiveFlights(): Promise<LiveFlight[]> {
    const [ivao, vatsim] = await Promise.all([
      this.ivaoFlightsUseCase.fetchLiveFlights(),
      this.vatsimFlightsUseCase.fetchLiveFlights(),
    ]);

    return [...ivao, ...vatsim];
  }
}
