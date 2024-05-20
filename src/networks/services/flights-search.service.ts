import {
  LiveFlightTrack,
  LiveFlightWithTracks,
} from '@/networks/dtos/live-flight.dto';
import { NetworksService } from '@/networks/services/networks.service';
import { Nullable } from '@/shared/utils/nullable';
import { searchInObjectRecursive } from '@/shared/utils/object';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import Redis from 'ioredis';

@Injectable()
export class FlightsSearchService {
  constructor(
    private readonly networksService: NetworksService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async findByParams(term: string) {
    const flights = await this.networksService.fetchLiveFlights();

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

  async findByID(flightId: string): Promise<Nullable<LiveFlightWithTracks>> {
    const [data, tracks] = await Promise.all([
      this.redis.get(`flight:${flightId}`),
      this.fetchTracksForFlight(flightId),
    ]);

    if (!data) {
      return null;
    }

    const plain = JSON.parse(data);

    const liveFlight = plainToInstance(LiveFlightWithTracks, plain);
    liveFlight.tracks = tracks;

    return liveFlight;
  }

  async fetchTracksForFlight(flightId: string): Promise<LiveFlightTrack[]> {
    const data = await this.redis.lrange(`tracks:${flightId}`, 0, -1);
    return data.map((d) => LiveFlightTrack.decode(d));
  }
}
