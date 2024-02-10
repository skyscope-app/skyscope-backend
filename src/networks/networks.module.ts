import { AirportsModule } from '@/airports/airports.module';
import { HttpModule } from '@/http/http.module';
import { NetworksController } from '@/networks/controllers/networks.controller';
import { IVAOService } from '@/networks/services/ivao.service';
import { VATSIMService } from '@/networks/services/vatsim.service';
import { Module } from '@nestjs/common';
import { CacheModule } from '@/cache/cache.module';
import { PosconService } from '@/networks/services/poscon.service';

@Module({
  imports: [HttpModule, AirportsModule, CacheModule],
  controllers: [NetworksController],
  providers: [VATSIMService, IVAOService, PosconService],
})
export class NetworksModule {}
