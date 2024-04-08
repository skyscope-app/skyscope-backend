import { Airport } from '@/airports/domain/airports.entity';
import { NavigraphAirportsService } from '@/navigraph/services/airports.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AirportsService {
  constructor(
    private readonly navigraphAirportService: NavigraphAirportsService,
  ) {}

  async findByICAO(icao: string) {
    const airport = await this.navigraphAirportService.findByICAO(icao);
    return airport ? Airport.fromNavigraph(airport) : null;
  }

  async getAirportsMap() {
    const airports = await this.navigraphAirportService.findAllAsMap();

    const domainAirports = Array.from(airports.values()).map(
      (navigraphAirport) => {
        return Airport.fromNavigraph(navigraphAirport);
      },
    );

    return new Map(domainAirports.map((airport) => [airport.icao, airport]));
  }
}
