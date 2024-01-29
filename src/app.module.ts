import { CacheModule as InternalCacheModule } from '@/cache/cache.module';
import { ConfigurationsModule } from '@/configurations/configuration.module';
import { LoggingInterceptor } from '@/logger/logger.interceptor';
import { NavdataModule } from '@/navdata/navdata.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { v4 } from 'uuid';
import { NetworksModule } from './networks/networks.module';
import { UsersModule } from '@/users/users.module';
import { getDatabaseModule } from '@/database/typeorm.module';
import { EnvironmentConfiguration } from '@/configurations/configuration';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    CacheModule.register({
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
  ],
  providers: [LoggingInterceptor],
})
export class AppModule {}
