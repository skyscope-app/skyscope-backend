import { FeatureFlagService } from '@/shared/services/feature-flag.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [FeatureFlagService],
  exports: [FeatureFlagService],
})
export class SharedModule {}
