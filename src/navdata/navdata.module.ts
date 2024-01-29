import { CacheModule } from '@/cache/cache.module';
import { HttpModule } from '@/http/http.module';
import { NatController } from '@/navdata/controllers/nat.controller';
import { NatService } from '@/navdata/services/nat.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [NatService],
  controllers: [NatController],
  exports: [NatService],
})
export class NavdataModule {}
