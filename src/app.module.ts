import { AuthModule } from '@/auth/auth.module';
import { CacheModule as InternalCacheModule } from '@/cache/cache.module';
import { EnvironmentConfiguration } from '@/configurations/configuration';
import { ConfigurationsModule } from '@/configurations/configuration.module';
import { getDatabaseModule } from '@/database/typeorm.module';
import { FilesModule } from '@/files/files.module';
import { IntegrationsModule } from '@/integrations/integrations.module';
import { LoggingInterceptor } from '@/logger/logger.interceptor';
import { LoggerModule } from '@/logger/logger.module';
import { NavdataModule } from '@/navdata/navdata.module';
import { NavigraphModule } from '@/navigraph/navigraph.module';
import { SettingsModule } from '@/settings/settings.module';
import { UsersModule } from '@/users/users.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import redisStore from 'cache-manager-redis-store';
import { ClsModule } from 'nestjs-cls';
import { v4 } from 'uuid';
import { NetworksModule } from './networks/networks.module';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: EnvironmentConfiguration.REDIS_URL,
    }),
    CacheModule.register({
      store: redisStore,
      url: EnvironmentConfiguration.REDIS_URL,
      isGlobal: true,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator() {
          return v4();
        },
      },
    }),
    getDatabaseModule(
      EnvironmentConfiguration.POSTGRES_HOST,
      Number(EnvironmentConfiguration.POSTGRES_PORT),
      EnvironmentConfiguration.POSTGRES_USER,
      EnvironmentConfiguration.POSTGRES_PASSWORD,
      EnvironmentConfiguration.POSTGRES_DATABASE,
      10,
      EnvironmentConfiguration.ENVIRONMENT,
    ),
    InternalCacheModule,
    ConfigurationsModule,
    NetworksModule,
    NavdataModule,
    UsersModule,
    AuthModule,
    IntegrationsModule,
    LoggerModule,
    FilesModule,
    RouterModule.register([
      {
        path: '/navigraph',
        module: NavigraphModule,
      },
    ]),
    NavigraphModule,
    SettingsModule,
  ],
  providers: [LoggingInterceptor],
})
export class AppModule {}
