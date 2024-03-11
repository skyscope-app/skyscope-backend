import { NetworksService } from '@/networks/services/networks.service';
import { searchInObjectRecursive } from '@/shared/utils/object';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FlightsSearchService {
  constructor(private readonly networksService: NetworksService) {}

  async findByParams(term: string) {
    const flights = await this.networksService.fetchCurrentLive();

    return flights.filter((flight) => {
      return searchInObjectRecursive(flight, term, [
        'flightPlan.arrival.lat',
        'flightPlan.arrival.lng',
        'flightPlan.departure.lng',
        'flightPlan.departure.lat',
        'flightPlan.alternate.lng',
        'flightPlan.alternate.lat',
        'flightPlan.alternate2.lng',
        'flightPlan.alternate2.lat',
        'flightPlan.level',
        'position.lat',
        'position.lng',
        'position.heading',
        'position.altitude',
        'position.groundSpeed',
      ]);
    });
  }

  async findByID(flightId: string) {
    const flights = await this.networksService.fetchCurrentLive();

    const flightsMap = new Map(flights.map((flight) => [flight.id, flight]));

    return flightsMap.get(flightId);
  }
}
