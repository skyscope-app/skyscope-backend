import { Airline } from '@/airlines/domain/airline';
import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';

@Injectable()
export class AirlinesService {
  async list(): Promise<Airline[]> {
    const data = await readFile(`./private_data/ICAO_Airlines.txt`, 'utf8');

    const lines = data
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
