import { LiveFlight } from '@/networks/dtos/live-flight.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FlightsSearchService {
  async searchFlight(term: string): Promise<LiveFlight[]> {
    return [];
  }
}
