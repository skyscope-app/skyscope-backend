import { Airac, AiracStatus } from '@/navdata/entity/airac';
import { ClsService } from 'nestjs-cls';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

export class BaseService {
  constructor(
    protected readonly currentDataSource: DataSource,
    protected readonly outdatedDataSource: DataSource,
    protected readonly clsService: ClsService,
  ) {}

  protected repository<T extends ObjectLiteral>(entity: EntityTarget<T>) {
    const subscription = this.clsService.get<Airac>('airac_subscription');

    if (
      !subscription ||
      subscription.status.toUpperCase() === AiracStatus.OUTDATED.toUpperCase()
    ) {
      return this.outdatedDataSource.getRepository(entity);
    }

    return this.currentDataSource.getRepository(entity);
  }

  protected queryBuilder() {
    const subscription = this.clsService.get<Airac>('airac_subscription');

    if (
      !subscription ||
      subscription.status.toUpperCase() === AiracStatus.OUTDATED.toUpperCase()
    ) {
      return this.outdatedDataSource.createQueryBuilder();
    }

    return this.currentDataSource.createQueryBuilder();
  }

  protected entityManager() {
    const subscription = this.clsService.get<Airac>('airac_subscription');

    if (
      !subscription ||
      subscription.status.toUpperCase() === AiracStatus.OUTDATED.toUpperCase()
    ) {
      return this.outdatedDataSource.createEntityManager();
    }

    return this.currentDataSource.createEntityManager();
  }

  protected datasource() {
    const subscription = this.clsService.get<Airac>('airac_subscription');

    if (
      !subscription ||
      subscription.status.toUpperCase() === AiracStatus.OUTDATED.toUpperCase()
    ) {
      return this.outdatedDataSource;
    }

    return this.currentDataSource;
  }
}
