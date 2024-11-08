import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async invalidate(key: string) {
    return this.cacheManager.del(key);
  }

  async set<T>(key: string, data: T, ttl?: number) {
    await this.cacheManager.set(key, data, { ttl } as any);
  }

  async handle<T>(key: string, cb: () => Promise<T>, ttl: number): Promise<T> {
    const cachedData = await this.cacheManager.get<T>(key);

    if (cachedData !== undefined && cachedData !== null) {
      return cachedData;
    }

    const nonCachedData = await cb();

    await this.cacheManager.set(key, nonCachedData, { ttl } as any);

    return nonCachedData;
  }

  async get<T>(key: string) {
    return this.cacheManager.get<T>(key);
  }

  async updateTtl(key: string, ttl: number) {
    const data = await this.get(key);
    await this.set(key, data, ttl);
  }
}
