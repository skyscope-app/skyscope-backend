import { ConfigurationsModule } from '@/configurations/configuration.module';
import { LoggingInterceptor } from '@/logger/logger.interceptor';
import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { v4 } from 'uuid';

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
  ],
  providers: [LoggingInterceptor],
})
export class AppModule {}
