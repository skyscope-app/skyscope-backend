import { AirlinesService } from '@/airlines/services/airlines.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [AirlinesService],
  exports: [AirlinesService],
})
export class AirlinesModule {}
