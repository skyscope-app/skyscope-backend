import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewIntegrations1714588232295 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE integration_provider RENAME TO integration_provider_old;`,
    );

    await queryRunner.query(
      `CREATE TYPE integration_provider AS ENUM ('navigraph', 'ivao', 'vatsim')`,
    );

    await queryRunner.query(
      `ALTER TABLE integrations ALTER COLUMN provider TYPE integration_provider USING provider::text::integration_provider;`,
    );

    await queryRunner.query(`DROP TYPE integration_provider_old;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE integration_provider RENAME TO integration_provider_old;`,
    );

    await queryRunner.query(
      `CREATE TYPE integration_provider AS ENUM ('navigraph')`,
    );

    await queryRunner.query(
      `ALTER TABLE integrations ALTER COLUMN provider TYPE integration_provider USING provider::text::integration_provider;`,
    );

    await queryRunner.query(`DROP TYPE integration_provider_old;`);
  }
}
