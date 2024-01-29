import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async invalidate(key: string) {
    return this.cacheManager.del(key);
  }

  async handle<T>(key: string, cb: () => Promise<T>, ttl: number): Promise<T> {
    const cachedData = await this.cacheManager.get<T>(key);

    if (cachedData !== undefined) {
      return cachedData;
    }

    const nonCachedData = await cb();

    await this.cacheManager.set(key, nonCachedData, ttl * 1000);

    return nonCachedData;
  }
}
