import { Controller, Get } from '@nestjs/common';
import { readdir } from 'fs/promises';

@Controller('files')
export class FilesController {
  @Get()
  getFiles() {
    return readdir('/tmp/skyscope', { recursive: true });
  }
}
