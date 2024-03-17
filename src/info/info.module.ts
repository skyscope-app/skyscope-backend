import { FilesController } from '@/info/controllers/files.controller';
import { Module } from '@nestjs/common';

@Module({ controllers: [FilesController] })
export class InfoModule {}
