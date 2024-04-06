import { CacheModule } from '@/cache/cache.module';
import { HttpModule } from '@/http/http.module';
import { NatController } from '@/navdata/controllers/nat.controller';
import { SimbriefController } from '@/navdata/controllers/simbrief.controller';
import { NatService } from '@/navdata/services/nat.service';
import { SimbriefService } from '@/navdata/services/simbrief.service';
import { Module } from '@nestjs/common';
import { AiracController } from '@/navdata/controllers/airac.controller';
import { AiracService } from '@/navdata/services/airac.service';
import { IntegrationsModule } from '@/integrations/integrations.module';
import { AiracRepository } from '@/navdata/repository/airac.repository';
import { NavigraphService } from '@/navdata/services/navigraph.service';
import { LoggerModule } from '@/logger/logger.module';

@Module({
  imports: [HttpModule, CacheModule, IntegrationsModule, LoggerModule],
  providers: [
    NatService,
    SimbriefService,
    AiracService,
    AiracRepository,
    NavigraphService,
  ],
  controllers: [NatController, SimbriefController, AiracController],
  exports: [NatService, SimbriefService, AiracService],
})
export class NavdataModule {}
