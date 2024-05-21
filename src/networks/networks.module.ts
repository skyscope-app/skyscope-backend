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
  providers: [NetworksService, FlightsSearchService, VatSpyService],
  exports: [NetworksService],
})
export class NetworksModule {}
