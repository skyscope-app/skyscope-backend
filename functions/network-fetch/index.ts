import { AppModule } from '@/app.module';
import { validateConfiguration } from '@/configurations/configuration';
import { IVAOService } from '@/networks/services/ivao.service';
import { VATSIMService } from '@/networks/services/vatsim.service';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { runWith } from 'firebase-functions';
import { Configuration } from 'functions/network-fetch/configuration';

export const networksFetcher = runWith({
  memory: '256MB',
  timeoutSeconds: 540,
})
  .pubsub.schedule('* * * * *')
  .onRun(async () => {
    await validateConfiguration(Configuration);

    const app = await NestFactory.createApplicationContext(AppModule);

    const logger = app.get(Logger);

    logger.log('Fetching networks...');

    const networksService = [app.get(IVAOService), app.get(VATSIMService)];

    await Promise.all(
      networksService.map((service) => service.fetchCurrentLive()),
    );

    logger.log('Finished fetching networks.');

    await app.close();
  });
