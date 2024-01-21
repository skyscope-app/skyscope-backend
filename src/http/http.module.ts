import { ConfigurationsModule } from '@/configurations/configuration.module';
import { HttpService } from '@/http/http.service';
import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [LoggerModule, ConfigurationsModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
