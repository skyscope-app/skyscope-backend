import { ConfigurationsModule } from '@/configurations/configuration.module';
import { LoggingInterceptor } from '@/logger/logger.interceptor';
import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { v4 } from 'uuid';
import { NetworksModule } from './networks/networks.module';

@Module({
  imports: [
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
    ConfigurationsModule,
    NetworksModule,
  ],
  providers: [LoggingInterceptor],
})
export class AppModule {}
