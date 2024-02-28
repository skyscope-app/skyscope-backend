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
          name: 'created_at',
          type: 'timestamptz',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamptz',
          default: 'now()',
        },
        {
          name: 'deleted_at',
          type: 'timestamptz',
          isNullable: true,
        },
      ],
    });
  }
}
