import { Module } from '@nestjs/common';
import { AirportsService } from '@/airports/airports.service';
import { CacheModule } from '@/cache/cache.module';
import { HttpModule } from '@/http/http.module';

@Module({
  imports: [CacheModule, HttpModule],
  providers: [AirportsService],
  exports: [AirportsService],
})
export class AirportsModule {}
