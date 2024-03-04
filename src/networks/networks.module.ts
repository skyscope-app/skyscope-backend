import { AirportsModule } from '@/airports/airports.module';
import { CacheModule } from '@/cache/cache.module';
import { HttpModule } from '@/http/http.module';
import { NetworksController } from '@/networks/controllers/networks.controller';
import { FlightsSearchService } from '@/networks/services/flights-search.service';
import { IVAOService } from '@/networks/services/ivao.service';
import { NetworksService } from '@/networks/services/networks.service';
import { PosconService } from '@/networks/services/poscon.service';
import { VATSIMService } from '@/networks/services/vatsim.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule, AirportsModule, CacheModule],
  controllers: [NetworksController],
  providers: [
    VATSIMService,
    IVAOService,
    PosconService,
    NetworksService,
    FlightsSearchService,
  ],
})
export class NetworksModule {}
