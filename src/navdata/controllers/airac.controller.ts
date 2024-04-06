import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authenticated, AuthenticatedUser } from '@/shared/utils/decorators';
import { AiracResponse } from '@/navdata/dtos/airac.dto';
import { AiracService } from '@/navdata/services/airac.service';
import { User } from '@/users/domain/user.entity';
import { CacheService } from '@/cache/cache.service';

@Controller('navdata/airac')
@ApiTags('Navdata', 'AIRAC')
@Authenticated()
export class AiracController {
  constructor(
    private airacService: AiracService,
    private logger: Logger,
    private cache: CacheService,
  ) {}

  @Get()
  @ApiOperation({
    description: 'Get current cycle available for authenticated user',
  })
  @ApiOkResponse({
    type: AiracResponse,
    description: 'Current airac available for user',
  })
  async getCurrent(@AuthenticatedUser() user: User) {
    const airac = await this.cache.handle(
      `navdata/airac/${user.id}`,
      () => this.airacService.findByUser(user),
      5 * 60,
    );

    if (!airac) {
      this.logger.error({ message: `No AIRAC found for user ${user.id}` });
      throw new InternalServerErrorException();
    }

    return new AiracResponse(airac);
  }
}
