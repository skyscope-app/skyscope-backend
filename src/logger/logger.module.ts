import { ConfigurationsModule } from '@/configurations/configuration.module';
import { InternalLogger } from '@/logger/logger.service';
import { Logger, Module } from '@nestjs/common';

@Module({
  imports: [ConfigurationsModule],
  providers: [
    {
      provide: Logger,
      useClass: process.env.ENVIRONMENT === 'local' ? Logger : InternalLogger,
    },
  ],
  exports: [Logger],
})
export class LoggerModule {}
