import { CacheService } from '@/cache/cache.service';
import { RouteResponse } from '@/navdata/dtos/route.dto';
import { NavigraphParseRouteUseCase } from '@/navigraph/usecase/parse-route.usecase';
import { Authenticated } from '@/shared/utils/decorators';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@Controller('route')
@ApiTags('Navigraph')
@Authenticated()
export class RouteController {
  constructor(
    private parseRouteUseCase: NavigraphParseRouteUseCase,
    private logger: Logger,
    private cache: CacheService,
  ) {}

  @Get()
  @ApiOperation({
    description: 'Parse a given route using navigraph data',
    summary: 'Parse a given route using navigraph data',
  })
  @ApiOkResponse({
    type: RouteResponse,
    description: 'Parsed route',
  })
  @ApiQuery({
    name: 'route',
    type: 'string',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid route for navigraph data',
  })
  async getCurrent(@Query('route') route: string) {
    const parsedRoute = await this.parseRouteUseCase.run(route);

    return RouteResponse.fromNavigraph(parsedRoute);
  }
}
