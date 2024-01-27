import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { Airport } from '@/airports/airports.entity';
import * as path from 'path';

@Injectable()
export class AirportsService {
  async getAirportsMap() {
    const filePath = path.join(__dirname, '../../../data/airports.json');

    const data = await readFile(filePath, { encoding: 'utf-8' }).then((r) =>
      JSON.parse(r),
    );

    const icaos = Object.keys(data);

    return new Map(icaos.map((icao) => [icao, new Airport(data[icao])]));
  }
}
