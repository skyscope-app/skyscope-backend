import { Injectable } from '@nestjs/common';
import { NetworkFlightUseCase } from '@/networks/domain/network-flight-use-case';
import { LiveFlight } from '../dtos/live-flight.dto';

@Injectable()
export class PosconFlightsUsecase implements NetworkFlightUseCase {
  fetchLiveFlights(): Promise<LiveFlight[]> {
    throw new Error('Method not implemented.');
  }
}
