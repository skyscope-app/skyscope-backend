import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFriendsTable1706503931880 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'friends',
        columns: [
          {
            name: 'owner_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'friend_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
        indices: [
          {
            columnNames: ['owner_id', 'friend_id'],
            isUnique: true,
            name: 'idx-unique-friends',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['owner_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            name: 'fk_ownerId_friends',
          },
          {
            columnNames: ['friend_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
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
