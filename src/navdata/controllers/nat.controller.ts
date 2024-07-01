import { Nat } from '@/navdata/dtos/nat.dto';
import { NatService } from '@/navdata/services/nat.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('navdata/nat')
@ApiTags('Navdata', 'NAT')
export class NatController {
  constructor(private natService: NatService) {}

  @Get()
  @ApiOperation({ description: 'Get current NATS' })
  @ApiOkResponse({ type: [Nat], description: 'Get current NATS' })
  getCurrent() {
    return this.natService.getCurrent();
  }
}
