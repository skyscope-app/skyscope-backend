import {
  Integration,
  IntegrationProviders,
} from '@/integrations/domain/integration';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/domain/user.entity';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectRepository(Integration)
    private readonly integrationsRepository: Repository<Integration>,
  ) {}

  async save(integration: Integration) {
    await this.integrationsRepository.upsert(integration, ['user', 'provider']);

    await this.integrationsRepository.update(
      { user: integration.user, provider: integration.provider },
      { deletedAt: null },
    );
  }

  async findByUserAndIntegrator(user: User, provider: IntegrationProviders) {
    return await this.integrationsRepository.findOne({
      where: { user: { uid: user.uid }, provider },
    });
  }
}
