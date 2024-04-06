import { FilesService } from '@/files/services/files.service';
import { VatSpyData } from '@/networks/dtos/vatspy.dto';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class VatSpyService {
  constructor(private readonly fileService: FilesService) {}

  async loadData() {
    const buffer = await this.fileService.getFromPrivate('vatspy.json');
    return plainToInstance(VatSpyData, JSON.parse(buffer.toString()));
  }
}
