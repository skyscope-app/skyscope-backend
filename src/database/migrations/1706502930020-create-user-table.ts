import { BaseMigrationTable } from '@/database/base.migration';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1706502930020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new BaseMigrationTable({
        name: 'users',
        columns: [
          {
            name: 'ivao_id',
            length: '10',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'vatsim_id',
            length: '10',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'poscon_id',
            type: 'varchar',
            length: '10',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'authentication_id',
            type: 'varchar',
            length: '128',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'navigraph_id',
            type: 'varchar',
            length: '128',
            isNullable: true,
          },
          {
            name: 'simbrief_id',
            type: 'varchar',
            length: '128',
            isNullable: true,
          },
        ],
      }),
      true,
      true,
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
