import { Controller, Get } from '@nestjs/common';
import { readdir } from 'fs/promises';

@Controller('files')
export class FilesController {
  @Get()
  getFiles() {
    const data = readdir('./navigraph-data', { recursive: true });
    return data;
  }
}
