import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAccountStatusToUser1711482874342 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE account_status AS ENUM ('created', 'active', 'suspended')`,
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'account_status',
        type: 'account_status',
        isNullable: false,
        default: `'created'`,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'account_status');
    await queryRunner.query('DROP TYPE account_status');
  }
}
