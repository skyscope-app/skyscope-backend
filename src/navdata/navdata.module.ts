import { CacheModule } from '@/cache/cache.module';
import { HttpModule } from '@/http/http.module';
import { IntegrationsModule } from '@/integrations/integrations.module';
import { LoggerModule } from '@/logger/logger.module';
import { NatController } from '@/navdata/controllers/nat.controller';
import { SimbriefController } from '@/navdata/controllers/simbrief.controller';
import { NatService } from '@/navdata/services/nat.service';
import { SimbriefService } from '@/navdata/services/simbrief.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule, CacheModule, IntegrationsModule, LoggerModule],
  providers: [NatService, SimbriefService],
  controllers: [NatController, SimbriefController],
  exports: [NatService, SimbriefService],
})
export class NavdataModule {}
