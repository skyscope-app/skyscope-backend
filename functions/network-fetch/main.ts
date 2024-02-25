import { AppModule } from '@/app.module';
import {
  Configuration,
  EnvironmentConfiguration,
  validateConfiguration,
} from '@/configurations/configuration';
import { InternalLogger } from '@/logger/logger.service';
import { IVAOService } from '@/networks/services/ivao.service';
import { VATSIMService } from '@/networks/services/vatsim.service';
import functions from '@google-cloud/functions-framework';
import { NestFactory } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';

export let clsService: ClsService;

functions.cloudEvent('networksFetcher', async (event) => {
  await validateConfiguration(Configuration);

  const app = await NestFactory.createApplicationContext(
    AppModule,
    EnvironmentConfiguration.ENVIRONMENT === 'main'
      ? {
          logger: new InternalLogger(EnvironmentConfiguration, clsService),
        }
      : {},
  );

  clsService = app.select(AppModule).get(ClsService);

  const networksService = [app.get(IVAOService), app.get(VATSIMService)];

  await Promise.all(
    networksService.map((service) => service.fetchCurrentLive()),
  );
});
