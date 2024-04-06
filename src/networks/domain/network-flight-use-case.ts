import { LiveFlight } from '@/networks/dtos/live-flight.dto';
import { LiveATC } from '@/networks/dtos/live-atc.dto';

export interface NetworkFlightUseCase {
  fetchLiveFlights(): Promise<Array<LiveFlight>>;
}

export interface NetworkATCUseCase {
  fetchLiveATCs(): Promise<Array<LiveATC>>;
}
