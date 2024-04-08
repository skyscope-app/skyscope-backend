import { Airac, AiracStatus } from '@/navdata/entity/airac';
import { ClsService } from 'nestjs-cls';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

export class BaseService {
  constructor(
    protected readonly currentDataSource: DataSource,
    protected readonly outdatedDataSource: DataSource,
    protected readonly clsService: ClsService,
  ) {}

  protected getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>) {
    const subscription = this.clsService.get<Airac>('airac_subscription');

    if (
      subscription.status.toUpperCase() === AiracStatus.OUTDATED.toUpperCase()
    ) {
      return this.outdatedDataSource.getRepository(entity);
    }

    return this.currentDataSource.getRepository(entity);
  }
}
