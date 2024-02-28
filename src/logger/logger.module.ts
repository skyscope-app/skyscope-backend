import { ConfigurationsModule } from '@/configurations/configuration.module';
import { InternalLogger } from '@/logger/logger.service';
import { Logger, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [ConfigurationsModule, ClsModule.forFeature()],
  providers: [
    {
      provide: Logger,
      useClass: process.env.ENVIRONMENT === 'main' ? InternalLogger : Logger,
    },
  ],
  exports: [Logger],
})
export class LoggerModule {}
