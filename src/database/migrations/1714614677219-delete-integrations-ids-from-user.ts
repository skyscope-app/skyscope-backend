import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class DeleteIntegrationsIdsFromUser1714614677219
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'ivao_id');
    await queryRunner.dropColumn('users', 'vatsim_id');
    await queryRunner.dropColumn('users', 'poscon_id');
    await queryRunner.dropColumn('users', 'navigraph_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'ivao_id',
        length: '10',
        type: 'varchar',
        isNullable: true,
        isUnique: true,
      }),
      new TableColumn({
        name: 'vatsim_id',
        length: '10',
        type: 'varchar',
        isNullable: true,
        isUnique: true,
      }),
      new TableColumn({
        name: 'poscon_id',
        type: 'varchar',
        length: '10',
        isNullable: true,
        isUnique: true,
      }),
      new TableColumn({
        name: 'navigraph_id',
        type: 'varchar',
        length: '128',
        isNullable: true,
      }),
    ]);
  }
}
