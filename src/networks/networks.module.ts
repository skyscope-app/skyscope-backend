import { AirportsModule } from '@/airports/airports.module';
import { CacheModule } from '@/cache/cache.module';
import { FilesModule } from '@/files/files.module';
import { HttpModule } from '@/http/http.module';
import { NetworksController } from '@/networks/controllers/networks.controller';
import { FlightsSearchService } from '@/networks/services/flights-search.service';
import { NetworksService } from '@/networks/services/networks.service';
import { VatSpyService } from '@/networks/services/vatspy.service';
import { IvaoATCsUseCase } from '@/networks/usecases/ivao-atcs.usecase';
import { IvaoFlightsUseCase } from '@/networks/usecases/ivao-flights-usecase';
import { PosconFlightsUsecase } from '@/networks/usecases/poscon-flights.usecase';
import { VatsimATCsUseCase } from '@/networks/usecases/vatsim-atcs.usecase';
import { VatsimFlightsUsecase } from '@/networks/usecases/vatsim-flights.usecase';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule, AirportsModule, CacheModule, FilesModule],
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
  ],
})
export class NetworksModule {}
