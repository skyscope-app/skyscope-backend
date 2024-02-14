import { Module } from '@nestjs/common';
import { IntegrationsService } from '@/integrations/services/integrations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integration } from '@/integrations/domain/integration';
import { IntegrationsController } from '@/integrations/controllers/integrations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Integration])],
  providers: [IntegrationsService],
  exports: [IntegrationsService],
  controllers: [IntegrationsController],
})
export class IntegrationsModule {}
