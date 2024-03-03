import { NetworksService } from '@/networks/services/networks.service';
import { getObjectRecursiveKeys } from '@/shared/utils/object';
import { Injectable } from '@nestjs/common';
import * as fuzzy from 'fuzzy-search';
@Injectable()
export class FlightsSearchService {
  constructor(private readonly networksService: NetworksService) {}

  private async loadFlightData() {
    const flights = await this.networksService.fetchCurrentLive();

    const fields = new Set(
      flights.flatMap((flight) => getObjectRecursiveKeys(flight)),
    );

    return new fuzzy(flights, [...fields], { caseSensitive: true });
  }

  async findByID(flightId: string) {
    const flights = await this.loadFlightData();

    const data = flights.search(flightId);

    if (data.length === 0) {
      return;
    }

    return data[0];
  }
}
