import { AuthModule } from '@/auth/auth.module';
import { CacheModule as InternalCacheModule } from '@/cache/cache.module';
import { PostgresStore } from '@/cache/postgres.store';
import { EnvironmentConfiguration } from '@/configurations/configuration';
import { ConfigurationsModule } from '@/configurations/configuration.module';
import { getDatabaseModule } from '@/database/typeorm.module';
import { LoggingInterceptor } from '@/logger/logger.interceptor';
import { NavdataModule } from '@/navdata/navdata.module';
import { UsersModule } from '@/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { v4 } from 'uuid';
import { NetworksModule } from './networks/networks.module';
import { IntegrationsModule } from '@/integrations/integrations.module';
import { LoggerModule } from '@/logger/logger.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: new PostgresStore({
        host: EnvironmentConfiguration.POSTGRES_HOST,
        database: EnvironmentConfiguration.POSTGRES_DATABASE,
        password: EnvironmentConfiguration.POSTGRES_PASSWORD,
        port: Number(EnvironmentConfiguration.POSTGRES_PORT),
        user: EnvironmentConfiguration.POSTGRES_USER,
        poolSize: 10,
      }),
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
  ],
  providers: [LoggingInterceptor],
})
export class AppModule {}
