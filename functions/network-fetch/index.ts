import { AppModule } from '@/app.module';
import { validateConfiguration } from '@/configurations/configuration';
import { IVAOService } from '@/networks/services/ivao.service';
import { VATSIMService } from '@/networks/services/vatsim.service';
import { NestFactory } from '@nestjs/core';
import { pubsub } from 'firebase-functions';
import { Configuration } from 'functions/network-fetch/configuration';

export const networksFetcher = pubsub.schedule('* * * * *').onRun(async () => {
  await validateConfiguration(Configuration);

  const app = await NestFactory.createApplicationContext(AppModule);

  const networksService = [app.get(IVAOService), app.get(VATSIMService)];

  await Promise.all(
    networksService.map((service) => service.fetchCurrentLive()),
  );
});
