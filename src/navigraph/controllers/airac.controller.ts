import { CacheService } from '@/cache/cache.service';
import { AiracResponse } from '@/navdata/dtos/airac.dto';
import { AiracService } from '@/navdata/services/airac.service';
import { Authenticated, AuthenticatedUser } from '@/shared/utils/decorators';
import { User } from '@/users/domain/user.entity';
import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('airac')
@ApiTags('Navigraph', 'AIRAC')
export class AiracController {
  constructor(
    private airacService: AiracService,
    private logger: Logger,
    private cache: CacheService,
  ) {}

  @Get()
  @ApiOperation({
    description: 'Get current cycle available for authenticated user',
    summary: 'Get current cycle available for authenticated user',
  })
  @ApiOkResponse({
    type: AiracResponse,
    description: 'Current airac available for user',
  })
  @Authenticated({ optional: true })
  async getCurrent(@AuthenticatedUser() user: User) {
    if (!user) {
      const airac = await this.airacService.findOutdated();

      if (!airac) {
        this.logger.error({ message: 'No AIRAC found' });
        throw new InternalServerErrorException();
      }

      return new AiracResponse(airac);
    }

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
