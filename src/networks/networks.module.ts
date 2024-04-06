import { AirportsModule } from '@/airports/airports.module';
import { CacheModule } from '@/cache/cache.module';
import { HttpModule } from '@/http/http.module';
import { NetworksController } from '@/networks/controllers/networks.controller';
import { FlightsSearchService } from '@/networks/services/flights-search.service';
import { IvaoFlightsUseCase } from '@/networks/usecases/ivao-flights-usecase';
import { NetworksService } from '@/networks/services/networks.service';
import { PosconFlightsUsecase } from '@/networks/usecases/poscon-flights.usecase';
import { VatsimFlightsUsecase } from '@/networks/usecases/vatsim-flights.usecase';
import { Module } from '@nestjs/common';
import { IvaoATCsUseCase } from '@/networks/usecases/ivao-atcs.usecase';
import { VatsimATCsUseCase } from '@/networks/usecases/vatsim-atcs.usecase';

@Module({
  imports: [HttpModule, AirportsModule, CacheModule],
  controllers: [NetworksController],
  providers: [
    VatsimFlightsUsecase,
    IvaoFlightsUseCase,
    PosconFlightsUsecase,
    NetworksService,
    IvaoATCsUseCase,
    VatsimATCsUseCase,
    FlightsSearchService,
  ],
})
export class NetworksModule {}
