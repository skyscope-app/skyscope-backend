import { HttpModule } from '@/http/http.module';
import { NetworksController } from '@/networks/controllers/networks.controller';
import { VATSIMService } from '@/networks/services/vatsim.service';
import { Module } from '@nestjs/common';
import { AirportsModule } from '@/airports/airports.module';

@Module({
  imports: [HttpModule, AirportsModule],
  controllers: [NetworksController],
  providers: [VATSIMService],
})
export class NetworksModule {}
