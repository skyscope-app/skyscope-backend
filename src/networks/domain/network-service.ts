import { LiveFlight } from '@/networks/dtos/live-flight.dto';

export interface NetworkService {
  fetchCurrentLive(): Promise<Array<LiveFlight>>;
}
