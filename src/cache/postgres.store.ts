import { CacheStore } from '@nestjs/cache-manager';
import * as moment from 'moment-timezone';
import { Client } from 'pg';
import * as Pool from 'pg-pool';

export interface PostgresStoreOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  poolSize: number;
}

export class PostgresStore implements CacheStore {
  private pool: Pool<Client>;

  constructor(private readonly options: PostgresStoreOptions) {
    this.pool = new Pool({
      host: options.host,
      port: options.port,
      user: options.user,
      password: options.password,
      database: options.database,
      max: options.poolSize,
    });
  }

  async set<T>(key: string, value: T, options?: number): Promise<void> {
    await this.deleteExpired();

    const expiresAt = moment.tz('UTC').add(options, 'milliseconds');

    const query = `INSERT INTO cache (key, value, "expiresAt")
                   VALUES ($1, $2, $3)
                   ON CONFLICT (key)
                   DO UPDATE SET value = $2, "expiresAt" = $3`;

    await this.pool.query(query, [key, value, expiresAt.toISOString()]);
  }

  async get<T>(key: string): Promise<T | undefined> {
    await this.deleteExpired();

    const query = `SELECT value, "expiresAt"
                   FROM cache
                   WHERE key = $1`;

    const result = await this.pool.query(query, [key]);

    if (result.rows.length === 0) {
      return undefined;
    }

    const { value, expiresAt } = result.rows[0];

    if (moment.tz(expiresAt, 'UTC').isBefore(moment.tz('UTC'))) {
      return undefined;
    }

    return value as T;
  }

  async del?(key: string): Promise<void> {
    await this.deleteExpired();

    const query = 'DELETE FROM cache WHERE key = $1';

    await this.pool.query(query, [key]);
  }

  private async deleteExpired(): Promise<void> {
    const query = `DELETE
                   FROM cache
                   WHERE "expiresAt" < $1`;

    await this.pool.query(query, [moment.tz('UTC').toISOString()]);
  }
}
