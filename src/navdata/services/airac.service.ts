import { IntegrationProviders } from '@/integrations/domain/integration';
import { IntegrationsService } from '@/integrations/services/integrations.service';
import { AiracStatus } from '@/navdata/entity/airac';
import { AiracRepository } from '@/navdata/repository/airac.repository';
import { NavigraphApiClient } from '@/navigraph/clients/navigraph.client';
import { User } from '@/users/domain/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiracService {
  constructor(
    private readonly integrationsService: IntegrationsService,
    private readonly airacRepository: AiracRepository,
    private readonly navigraphService: NavigraphApiClient,
  ) {}

  async findByUser(user: User) {
    const integration = await this.integrationsService.findByUserAndIntegrator(
      user,
      IntegrationProviders.Navigraph,
    );

    if (!integration) {
      return this.airacRepository.find(AiracStatus.OUTDATED);
    }

    const desiredStatus =
      await this.navigraphService.validateSubscription(integration);

    return this.airacRepository.find(desiredStatus);
  }

  async findOutdated() {
    return this.airacRepository.find(AiracStatus.OUTDATED);
  }
}
