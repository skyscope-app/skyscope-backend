import { Airport } from '@/airports/airports.entity';
import { OurAirportsDto } from '@/airports/dtos/our-airports.dto';
import { CacheService } from '@/cache/cache.service';
import { NavigraphAirportsService } from '@/navigraph/services/airports.service';
import { parseCSV } from '@/shared/utils/csvParser';
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { readFile } from 'fs/promises';
import * as path from 'path';

@Injectable()
export class AirportsService {
  public readonly axios: AxiosInstance;
  private url =
    'https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv';

  constructor(
    private readonly cacheService: CacheService,
    private readonly navigraphAirportService: NavigraphAirportsService,
  ) {
    this.axios = axios.create({});
  }
  '';
  async getFromNavigraph(): Promise<Map<string, Airport>> {
    const airports = await this.navigraphAirportService.findAllAsMap();

    const domainAirports = Array.from(airports.values()).map(
      (navigraphAirport) => {
        return new Airport(
          navigraphAirport.icao,
          navigraphAirport.iata,
          navigraphAirport.name,
          navigraphAirport.latitude,
          navigraphAirport.longitude,
          navigraphAirport.elevation,
        );
      },
    );

    return new Map(domainAirports.map((airport) => [airport.icao, airport]));
  }

  async getAirportsMapFromCSV(): Promise<Map<string, Airport>> {
    const airports = await this.cacheService.handle(
      'airports_map_csv',
      async () => {
        const rawString = await this.axios
          .get<string>(this.url)
          .then((r) => r.data);

        const airports = parseCSV(rawString, OurAirportsDto).map((airport) => {
          return new Airport(
            airport.ident,
            airport.iata_code,
            airport.name,
            Number(airport.latitude_deg),
            Number(airport.longitude_deg),
            Number(airport.elevation_ft),
          );
        });

        return airports;
      },
      12 * 60 * 60,
    );

    return new Map(airports.map((airport) => [airport.icao, airport]));
  }

  async getAirportsMapFromJSON() {
    const filePath = path.join(__dirname, '../../../data/airports.json');

    const data = await readFile(filePath, { encoding: 'utf-8' }).then((r) =>
      JSON.parse(r),
    );

    const airports = Object.keys(data);

    return new Map(
      airports.map((icao) => {
        const airport = data[icao];
        return [
          icao,
          new Airport(
            airport.icao,
            airport.iata,
            airport.name,
            airport.lat,
            airport.lon,
            0,
          ),
        ];
      }),
    );
  }

  async getAirportsMap() {
    return await this.getFromNavigraph()
      .catch(() => this.getAirportsMapFromCSV())
      .catch(() => this.getAirportsMapFromJSON());
  }
}
