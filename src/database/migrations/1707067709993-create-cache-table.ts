import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCacheTable1707067709993 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cache',
        columns: [
          {
            name: 'key',
            isUnique: true,
            isNullable: false,
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'expiresAt',
            type: 'timestamptz',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cache');
  }
}
