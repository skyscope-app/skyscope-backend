import { AirportsService } from '@/airports/airports.service';
import { Network, NetworkAirportFlights } from '@/networks/domain/network';
import { LiveATC } from '@/networks/dtos/live-atc.dto';
import {
  LiveFlight,
  LiveFlightTrack,
  LiveFlightWithTracks,
} from '@/networks/dtos/live-flight.dto';
import { Nullable } from '@/shared/utils/nullable';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import Redis from 'ioredis';

@Injectable()
export class NetworksService {
  constructor(
    private readonly airportsService: AirportsService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async findATCById(atcId: string) {
    const data = await this.redis.get(`atc:${atcId}`);

    if (!data) {
      return;
    }

    return plainToInstance(LiveATC, JSON.parse(data));
  }

  async fetchTracksForFlight(flightId: string): Promise<LiveFlightTrack[]> {
    const data = await this.redis.lrange(`tracks:${flightId}`, 0, -1);
    return data
      .map((d) => LiveFlightTrack.decode(d))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  async findFlightById(
    flightId: string,
  ): Promise<Nullable<LiveFlightWithTracks>> {
    const [data, tracks, airports] = await Promise.all([
      this.redis.get(`flight:${flightId}`),
      this.fetchTracksForFlight(flightId),
      this.airportsService.getAirportsMap(),
    ]);

    if (!data) {
      return null;
    }

    const plain = JSON.parse(data);

    const liveFlight = plainToInstance(LiveFlightWithTracks, plain);
    liveFlight.tracks = tracks;

    liveFlight.enrichAirports(airports);

    return liveFlight;
  }

  async fetchLiveFlights(): Promise<LiveFlight[]> {
    const [ivao, vatsim] = await Promise.all(
      [Network.IVAO, Network.VATSIM].map((network) =>
        this.findFlightsByNetwork(network),
      ),
    );

    return [...ivao, ...vatsim];
  }

  async findATCsByNetwork(network: Network) {
    const key = `${network}_atcs`;

    const [data] = await Promise.all([this.redis.get(key)]);

    if (!data) {
      return [];
    }

    const raw = JSON.parse(data) as any[];

    return raw.map((d) => plainToInstance(LiveATC, d));
  }

  async findFlightsByNetwork(network: Network) {
    const key = `${network}_flights`;

    const [data, airports] = await Promise.all([
      this.redis.get(key),
      this.airportsService.getAirportsMap(),
    ]);

    if (!data) {
      return [];
    }

    const raw = JSON.parse(data) as object[];

    return raw
      .map((d) => plainToInstance(LiveFlight, d))
      .map((f) => {
        f.enrichAirports(airports);
        return f;
      });
  }

  async fetchAirportFlights(
    icao: string,
  ): Promise<Map<Network, NetworkAirportFlights>> {
    const [vatsim, ivao] = await Promise.all([
      this.findFlightsByNetwork(Network.VATSIM),
      this.findFlightsByNetwork(Network.IVAO),
    ]);

    const flights = [...ivao, ...vatsim];

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
