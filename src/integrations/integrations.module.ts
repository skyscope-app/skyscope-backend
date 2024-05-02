import { CacheModule } from '@/cache/cache.module';
import { IntegrationsController } from '@/integrations/controllers/integrations.controller';
import { Integration } from '@/integrations/domain/integration';
import { IntegrationsService } from '@/integrations/services/integrations.service';
import { User } from '@/users/domain/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Integration, User]), CacheModule],
  providers: [IntegrationsService],
  exports: [IntegrationsService],
  controllers: [IntegrationsController],
})
export class IntegrationsModule {}
