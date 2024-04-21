import { AirlinesService } from '@/airlines/services/airlines.service';
import { FilesModule } from '@/files/files.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [FilesModule],
  providers: [AirlinesService],
  exports: [AirlinesService],
})
export class AirlinesModule {}
