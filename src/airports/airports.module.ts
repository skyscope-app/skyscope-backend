import { Module } from '@nestjs/common';
import { AirportsService } from '@/airports/airports.service';

@Module({
  providers: [AirportsService],
  exports: [AirportsService],
})
export class AirportsModule {}
