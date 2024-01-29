import { CacheService } from '@/cache/cache.service';
import { HttpService } from '@/http/http.service';
import { Nat } from '@/navdata/dtos/nat.dto';
import { Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

@Injectable()
export class NatService {
  private url = 'https://api.flightplandatabase.com/nav/NATS';
  private parser = new XMLParser();

  constructor(
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {}

  async getCurrent() {
    const data = await this.fetch();
    return data.map((nat) => {
      return new Nat(nat);
    });
  }

  private fetch() {
    return this.cacheService.handle(
      'nats',
      async () => {
        return this.httpService.get(this.url).then((r) => r.data);
      },
      60 * 60,
    );
  }
}
