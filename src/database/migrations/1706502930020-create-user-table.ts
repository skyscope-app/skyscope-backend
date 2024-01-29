import { BaseMigrationTable } from '@/database/base.migration';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1706502930020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new BaseMigrationTable({
        name: 'users',
        columns: [
          {
            name: 'ivaoId',
            length: '10',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'vatsimId',
            length: '10',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'posconId',
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
            name: 'authenticationId',
            type: 'varchar',
            length: '128',
            isNullable: false,
            isUnique: true,
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
