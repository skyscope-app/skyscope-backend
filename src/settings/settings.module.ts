import { Module } from '@nestjs/common';
import { SettingsController } from '@/settings/controllers/settings.controller';
import { SettingsService } from '@/settings/services/settings.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
