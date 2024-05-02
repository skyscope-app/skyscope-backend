import { CacheService } from '@/cache/cache.service';
import {
  Integration,
  IntegrationProviders,
} from '@/integrations/domain/integration';
import { User } from '@/users/domain/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectRepository(Integration)
    private readonly integrationsRepository: Repository<Integration>,
    private readonly cacheService: CacheService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async save(integration: Integration) {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      integration.providerId = this.getProviderId(integration.accessToken);

      await transactionalEntityManager.upsert(Integration, integration, [
        'user',
        'provider',
      ]);

      await transactionalEntityManager.update(
        Integration,
        {
          user: integration.user,
          provider: integration.provider,
        },
        { deletedAt: null },
      );
    });

    await this.cacheService.invalidate(integration.user.authenticationId);
  }

  getProviderId(token: string): string {
    const parsedToken = token
      .split('.')
      .slice(0, 2)
      .map((segment) =>
        JSON.parse(Buffer.from(segment, 'base64').toString('ascii')),
      )[1];
    return parsedToken['sub'] as string;
  }

  async findByUserAndIntegrator(user: User, provider: IntegrationProviders) {
    return await this.integrationsRepository.findOne({
      where: { user: { uid: user.uid }, provider },
    });
  }
}
