import { AirportsService } from '@/airports/airports.service';
import {
  AirportDetailedResponse,
  AirportResponse,
  AirportSummaryResponse,
} from '@/airports/dtos/airport.dto';
import { NetworksService } from '@/networks/services/networks.service';
import { Authenticated } from '@/shared/utils/decorators';
import { WeatherService } from '@/weather/services/weather.service';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('/airports')
@Authenticated()
@ApiTags('Airports')
export class AirportsController {
  constructor(
    private readonly airportsService: AirportsService,
    private readonly weatherService: WeatherService,
    private readonly networksService: NetworksService,
  ) {}

  @Get('/summary')
  @ApiOperation({ description: 'Get a list of summary airports' })
  @ApiOkResponse({ type: [AirportSummaryResponse] })
  async listAirportsSummary() {
    const airports = await this.airportsService.list();

    return airports.map((airport) => new AirportSummaryResponse(airport));
  }

  @Get(':icao')
  @ApiOperation({ description: 'Get an airport by its ICAO code' })
  @ApiOkResponse({ type: AirportResponse })
  async getAirport(@Param('icao') icao: string) {
    const [airport, metar, taf, flights] = await Promise.all([
      this.airportsService.findByICAO(icao.toUpperCase()),
      this.weatherService.findMetar(icao.toUpperCase()),
      this.weatherService.findTaf(icao.toUpperCase()),
      this.networksService.fetchAirportFlights(icao.toUpperCase()),
    ]);

    if (!airport) {
      throw new NotFoundException();
    }

    return new AirportDetailedResponse(airport, metar, taf, flights);
  }
}
