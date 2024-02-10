import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCacheTable1707067709993 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE UNLOGGED TABLE cache (
          key varchar(255) NOT NULL,
          value jsonb NOT NULL,
          "expiresAt" timestamptz NOT NULL,
          CONSTRAINT uk_cache_key UNIQUE (key)
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cache');
  }
}
