import { BaseMigrationTable } from '@/database/base.migration';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIntegrationsTable1707915125434
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE integration_provider AS ENUM ('navigraph')`,
    );

    await queryRunner.createTable(
      new BaseMigrationTable({
        name: 'integrations',
        columns: [
          {
            name: 'provider',
            type: 'integration_provider',
            isNullable: false,
          },
          { name: 'provider_id', type: 'varchar(255)', isNullable: false },
          {
            name: 'user_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'access_token',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'refresh_token',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'expires_at',
            type: 'timestamptz',
            isNullable: false,
          },
        ],
        indices: [
          {
            name: 'idx-unique-provider-id',
            columnNames: ['user_id', 'provider'],
            isUnique: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TYPE integration_provider');
    await queryRunner.dropTable('integrations');
  }
}
