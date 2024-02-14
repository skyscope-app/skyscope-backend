import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Integration } from '@/integrations/domain/integration';
import { Repository } from 'typeorm';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectRepository(Integration)
    private readonly integrationsRepository: Repository<Integration>,
  ) {}

  save(integration: Integration) {
    return this.integrationsRepository.save(integration);
  }
}
