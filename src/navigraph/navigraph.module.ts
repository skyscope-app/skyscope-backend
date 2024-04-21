import { CacheModule } from '@/cache/cache.module';
import { EnvironmentConfiguration } from '@/configurations/configuration';
import { HttpModule } from '@/http/http.module';
import { IntegrationsModule } from '@/integrations/integrations.module';
import { LoggerModule } from '@/logger/logger.module';
import { AiracRepository } from '@/navdata/repository/airac.repository';
import { AiracService } from '@/navdata/services/airac.service';
import { NavigraphApiClient } from '@/navigraph/clients/navigraph.client';
import { AiracController } from '@/navigraph/controllers/airac.controller';
import { RouteController } from '@/navigraph/controllers/route.controller';
import { NavigraphAirport } from '@/navigraph/entities/navigraph_airport.entity';
import { NavigraphAirportGate } from '@/navigraph/entities/navigraph_airport_gate.entity';
import { NavigraphAirportRunway } from '@/navigraph/entities/navigraph_airport_runway.entity';
import { NavigraphAirway } from '@/navigraph/entities/navigraph_airway.entity';
import { NavigraphAirportsService } from '@/navigraph/services/airports.service';
import { NavigraphParseRouteUseCase } from '@/navigraph/usecase/parse-route.usecase';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const entities = [
  NavigraphAirport,
  NavigraphAirportGate,
  NavigraphAirportRunway,
  NavigraphAirway,
];

export const getNavigraphModule = (file: string, name: string) => {
  return TypeOrmModule.forRoot({
    type: 'sqlite',
    database: file,
    name: name,
    entities,
    synchronize: false,
    logging: EnvironmentConfiguration.ENVIRONMENT === 'local',
    cache: true,
  });
};

@Module({
  imports: [
    IntegrationsModule,
    HttpModule,
    LoggerModule,
    CacheModule,
    getNavigraphModule('/tmp/skyscope/current.s3db', 'current'),
    getNavigraphModule('/tmp/skyscope/outdated.s3db', 'outdated'),
    TypeOrmModule.forFeature(entities, 'current'),
    TypeOrmModule.forFeature(entities, 'outdated'),
  ],
  controllers: [AiracController, RouteController],
  providers: [
    AiracService,
    AiracRepository,
    NavigraphApiClient,
    NavigraphAirportsService,
    NavigraphParseRouteUseCase,
  ],
  exports: [AiracService, NavigraphAirportsService, NavigraphParseRouteUseCase],
})
export class NavigraphModule {}
