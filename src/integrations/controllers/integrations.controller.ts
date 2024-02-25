import { CreateIntegrationDTO } from '@/integrations/dto/create-integration.dto';
import { IntegrationsService } from '@/integrations/services/integrations.service';
import { BodyParserPipe } from '@/shared/pipes/body-parser.pipe';
import { Authenticated, AuthenticatedUser } from '@/shared/utils/decorators';
import { User } from '@/users/domain/user.entity';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Integrations')
@Controller('integrations')
@Authenticated()
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post()
  @ApiOperation({
    description:
      'Save a new integration credentials for current authenticated user',
  })
  @ApiCreatedResponse({ description: 'Integration successfully created' })
  private async createIntegrations(
    @AuthenticatedUser() user: User,
    @Body(new BodyParserPipe(CreateIntegrationDTO)) body: CreateIntegrationDTO,
  ) {
    await this.integrationsService.save(body.toDomain(user));
  }
}
