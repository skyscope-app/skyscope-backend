import { Injectable } from '@nestjs/common';
import { IntegrationsService } from '@/integrations/services/integrations.service';
import { User } from '@/users/domain/user.entity';
import { IntegrationProviders } from '@/integrations/domain/integration';
import { AiracRepository } from '@/navdata/repository/airac.repository';
import { AiracStatus } from '@/navdata/entity/airac';
import { NavigraphService } from '@/navdata/services/navigraph.service';

@Injectable()
export class AiracService {
  constructor(
    private readonly integrationsService: IntegrationsService,
    private readonly airacRepository: AiracRepository,
    private readonly navigraphService: NavigraphService,
  ) {}

  async findByUser(user: User) {
    const integration = await this.integrationsService.findByUserAndIntegrator(
      user,
      IntegrationProviders.Navigraph,
    );

    if (!integration) {
      return this.airacRepository.find(AiracStatus.OUTDATED);
    }

    const desiredStatus = await this.navigraphService.validate(integration);

    return this.airacRepository.find(desiredStatus);
  }
}
