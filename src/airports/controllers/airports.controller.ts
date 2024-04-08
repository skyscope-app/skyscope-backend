import { AirportsService } from '@/airports/airports.service';
import { AirportResponse } from '@/airports/dtos/airport.dto';
import { Authenticated } from '@/shared/utils/decorators';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('/airports')
@Authenticated()
@ApiTags('Airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Get(':icao')
  @ApiOperation({ description: 'Get an airport by its ICAO code' })
  @ApiOkResponse({ type: AirportResponse })
  async getAirport(@Param('icao') icao: string) {
    const airport = await this.airportsService.findByICAO(icao);

    if (!airport) {
      throw new NotFoundException();
    }

    return new AirportResponse(airport);
  }
}
