import { Integration } from '@/integrations/domain/integration';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
