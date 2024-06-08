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
    const [traffic, airports] = await Promise.all([
      this.networksService.fetchLiveFlights(),
      this.airportsService.list(),
    ]);

    const data = airports.map(
      (airport) =>
        new AirportSummaryResponse(
          airport,
          traffic.filter((flight) => {
            return (
              flight.flightPlan?.departure.icao === airport.icao ||
              flight.flightPlan?.arrival.icao === airport.icao
            );
          }),
        ),
    );

    return data.filter(
      (airport) =>
        airport.stats.vatsim.departure > 0 ||
        airport.stats.ivao.departure > 0 ||
        airport.stats.vatsim.arrival > 0 ||
        airport.stats.ivao.arrival > 0,
    );
  }

  @Get(':icao')
  @ApiOperation({ description: 'Get an airport by its ICAO code' })
  @ApiOkResponse({ type: AirportResponse })
  async getAirport(@Param('icao') icao: string) {
    const [airport, metar, taf, flights] = await Promise.all([
      this.airportsService.findByICAO(icao.toUpperCase()),
      this.weatherService.findMetar(icao.toUpperCase()).catch((error) => null),
      this.weatherService.findTaf(icao.toUpperCase()).catch((error) => null),
      this.networksService.fetchAirportFlights(icao.toUpperCase()),
    ]);

    if (!airport) {
      throw new NotFoundException();
    }

    return new AirportDetailedResponse(airport, metar, taf, flights);
  }
}
