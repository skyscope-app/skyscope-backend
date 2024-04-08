import { AirportsService } from '@/airports/airports.service';
import { CacheModule } from '@/cache/cache.module';
import { HttpModule } from '@/http/http.module';
import { NavigraphModule } from '@/navigraph/navigraph.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CacheModule, HttpModule, NavigraphModule],
  providers: [AirportsService],
  exports: [AirportsService],
})
export class AirportsModule {}
