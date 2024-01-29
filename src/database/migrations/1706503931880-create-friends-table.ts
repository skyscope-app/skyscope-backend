import { BaseMigrationTable } from '@/database/base.migration';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFriendsTable1706503931880 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new BaseMigrationTable({
        name: 'friends',
        columns: [
          {
            name: 'ownerId',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'friendId',
            type: 'bigint',
            isNullable: false,
          },
        ],
        indices: [
          {
            columnNames: ['ownerId', 'friendId'],
            isUnique: true,
            name: 'idx-unique-friends',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['ownerId'],
            referencedTableName: 'users',
            referencedColumnNames: ['iid'],
            name: 'fk_ownerId_friends',
          },
          {
            columnNames: ['friendId'],
            referencedTableName: 'users',
            referencedColumnNames: ['iid'],
            name: 'fk_friendId_friends',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('friends');
  }
}
