import { Route } from '@/navdata/dtos/route.dto';
import { SimbriefService } from '@/navdata/services/simbrief.service';
import { Authenticated, AuthenticatedUser } from '@/shared/utils/decorators';
import { User } from '@/users/domain/user.entity';
import { Controller, Get, UnprocessableEntityException } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('simbrief')
export class SimbriefController {
  constructor(private readonly simbriefService: SimbriefService) {}

  @Get('/current')
  @Authenticated()
  @ApiOperation({ description: 'User current navigation route' })
  async current(@AuthenticatedUser() user: User) {
    if (!user.simbriefId) {
      throw new UnprocessableEntityException('Simbrief ID not found');
    }

    const data = await this.simbriefService.current(user.simbriefId);

    return new Route(data);
  }
}
