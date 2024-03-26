import { FilesService } from '@/files/services/files.service';
import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [LoggerModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
