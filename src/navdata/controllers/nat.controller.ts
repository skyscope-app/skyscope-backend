import { Nat } from '@/navdata/dtos/nat.dto';
import { NatService } from '@/navdata/services/nat.service';
import { Authenticated, cacheControl } from '@/shared/decorators';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('navdata/nat')
@ApiTags('Navdata', 'NAT')
@Authenticated()
export class NatController {
  constructor(private natService: NatService) {}

  @Get()
  @ApiOperation({ description: 'Get current NATS' })
  @ApiOkResponse({ type: [Nat], description: 'Get current NATS' })
  @cacheControl.CacheControl({
    directive: cacheControl.Directive.PRIVATE,
    maxAge: 60 * 60,
  })
  getCurrent() {
    return this.natService.getCurrent();
  }
}
