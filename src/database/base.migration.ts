import { Table, TableOptions } from 'typeorm';

export class BaseMigrationTable extends Table {
  constructor(options: TableOptions) {
    super({
      ...options,
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
          isNullable: false,
          isUnique: true,
        },
        {
          name: 'uid',
          type: 'uuid',
          default: 'gen_random_uuid()',
          isUnique: true,
        },
        ...(options.columns ?? []),
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updatedAt',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'deletedAt',
          type: 'timestamp',
          isNullable: true,
        },
      ],
    });
  }
}
