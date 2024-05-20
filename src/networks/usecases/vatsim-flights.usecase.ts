import { LiveFlight } from '@/networks/dtos/live-flight.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import Redis from 'ioredis';

@Injectable()
export class VatsimFlightsUsecase {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public async fetchLiveFlights(): Promise<Array<LiveFlight>> {
    const data = await this.redis.get('vatsim_flights');

    if (!data) {
      return [];
    }

    const raw = JSON.parse(data) as object[];

    return raw.map((d) => plainToInstance(LiveFlight, d));
  }
}
