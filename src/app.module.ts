import { CacheModule as InternalCacheModule } from '@/cache/cache.module';
import { ConfigurationsModule } from '@/configurations/configuration.module';
import { LoggingInterceptor } from '@/logger/logger.interceptor';
import { NavdataModule } from '@/navdata/navdata.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { v4 } from 'uuid';
import { NetworksModule } from './networks/networks.module';

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
    InternalCacheModule,
    ConfigurationsModule,
    NetworksModule,
    NavdataModule,
  ],
  providers: [LoggingInterceptor],
})
export class AppModule {}
