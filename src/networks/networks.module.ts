import { AirlinesModule } from '@/airlines/airlines.module';
import { AirportsModule } from '@/airports/airports.module';
import { CacheModule } from '@/cache/cache.module';
import { ConfigurationsModule } from '@/configurations/configuration.module';
import { FilesModule } from '@/files/files.module';
import { HttpModule } from '@/http/http.module';
import { NavigraphModule } from '@/navigraph/navigraph.module';
import { NetworksController } from '@/networks/controllers/networks.controller';
import { FlightsSearchService } from '@/networks/services/flights-search.service';
import { NetworksService } from '@/networks/services/networks.service';
import { VatSpyService } from '@/networks/services/vatspy.service';
import { IvaoATCsUseCase } from '@/networks/usecases/ivao-atcs.usecase';
import { IvaoFlightsUseCase } from '@/networks/usecases/ivao-flights-usecase';
import { PosconFlightsUsecase } from '@/networks/usecases/poscon-flights.usecase';
import { VatsimATCsUseCase } from '@/networks/usecases/vatsim-atcs.usecase';
import { VatsimFlightsUsecase } from '@/networks/usecases/vatsim-flights.usecase';
import { OAuth2Service } from '@/shared/services/oauth2.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    HttpModule,
    AirportsModule,
    CacheModule,
    FilesModule,
    NavigraphModule,
    AirlinesModule,
    ConfigurationsModule,
  ],
  controllers: [NetworksController],
  providers: [
    VatsimFlightsUsecase,
    IvaoFlightsUseCase,
    PosconFlightsUsecase,
    NetworksService,
    IvaoATCsUseCase,
    VatsimATCsUseCase,
    FlightsSearchService,
    VatSpyService,
    OAuth2Service,
  ],
})
export class NetworksModule {}
