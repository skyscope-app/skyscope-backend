import {
  Configuration,
  getConfiguration,
} from '@/configurations/configuration';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    { provide: Configuration, useValue: getConfiguration(Configuration) },
  ],
  exports: [Configuration],
})
export class ConfigurationsModule {}
