import { LiveFlightTrack } from '@/networks/dtos/live-flight.dto';
import { NetworksService } from '@/networks/services/networks.service';
import { searchInObjectRecursive } from '@/shared/utils/object';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class FlightsSearchService {
  constructor(
    private readonly networksService: NetworksService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

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

  async fetchTracksForFlight(flightId: string): Promise<LiveFlightTrack[]> {
    const data = await this.redis.lrange(`tracks:${flightId}`, 0, -1);
    return data.map((d) => LiveFlightTrack.decode(d));
  }
}
