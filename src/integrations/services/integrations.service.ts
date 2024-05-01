import {
  Integration,
  IntegrationProviders,
} from '@/integrations/domain/integration';
import { User } from '@/users/domain/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectRepository(Integration)
    private readonly integrationsRepository: Repository<Integration>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async save(integration: Integration) {
    integration.providerId = this.getProviderId(integration.accessToken);

    await this.integrationsRepository.upsert(integration, ['user', 'provider']);

    await this.integrationsRepository.update(
      { user: integration.user, provider: integration.provider },
      { deletedAt: null },
    );

    await this.userRepository.update(integration.user.id, {
      vatsimId: integration.user.vatsimId,
      ivaoId: integration.user.ivaoId,
      navigraphId: integration.user.navigraphId,
    });
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
