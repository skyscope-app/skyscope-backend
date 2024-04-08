import { CacheModule } from '@/cache/cache.module';
import { EnvironmentConfiguration } from '@/configurations/configuration';
import { HttpModule } from '@/http/http.module';
import { IntegrationsModule } from '@/integrations/integrations.module';
import { LoggerModule } from '@/logger/logger.module';
import { AiracRepository } from '@/navdata/repository/airac.repository';
import { AiracService } from '@/navdata/services/airac.service';
import { NavigraphApiClient } from '@/navigraph/clients/navigraph.client';
import { AiracController } from '@/navigraph/controllers/airac.controller';
import { NavigraphAirport } from '@/navigraph/entities/airport.entity';
import { NavigraphAirportsService } from '@/navigraph/services/airports.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

export const getNavigraphModule = (file: string, name: string) => {
  return TypeOrmModule.forRoot({
    type: 'sqlite',
    database: file,
    name: name,
    entities: [NavigraphAirport],
    synchronize: false,
    logging: EnvironmentConfiguration.ENVIRONMENT === 'local',
  });
};

@Module({
  imports: [
    IntegrationsModule,
    HttpModule,
    LoggerModule,
    CacheModule,
    getNavigraphModule('./private_data/current.s3db', 'current'),
    getNavigraphModule('./private_data/outdated.s3db', 'outdated'),
    TypeOrmModule.forFeature([NavigraphAirport], 'current'),
  ],
  controllers: [AiracController],
  providers: [
    AiracService,
    AiracRepository,
    NavigraphApiClient,
    NavigraphAirportsService,
  ],
  exports: [AiracService, NavigraphAirportsService],
})
export class NavigraphModule {}
