import { Airline } from '@/airlines/domain/airline';
import { FilesService } from '@/files/services/files.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AirlinesService {
  constructor(private readonly fileService: FilesService) {}

  async list(): Promise<Airline[]> {
    const data = await this.fileService.getFromPrivate('ICAO_Airlines.txt');

    const lines = String(data)
      .split('\r\n')
      .filter((l) => !l.includes(';'))
      .map((l) => {
        const data = l.split('\t');
        return {
          icao: data[0],
          name: data[1],
          callsign: data[2],
          country: data[3],
        };
      });

    return lines.map((l) => new Airline(l));
  }
}
