import { AirportsModule } from '@/airports/airports.module';
import { HttpModule } from '@/http/http.module';
import { NetworksController } from '@/networks/controllers/networks.controller';
import { IVAOService } from '@/networks/services/ivao.service';
import { VATSIMService } from '@/networks/services/vatsim.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule, AirportsModule],
  controllers: [NetworksController],
  providers: [VATSIMService, IVAOService],
})
export class NetworksModule {}
