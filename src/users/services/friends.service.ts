import { User } from '@/users/domain/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AddFriendDto } from '@/users/dtos/add-friend.dto';
import { Integration } from '@/integrations/domain/integration';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Integration)
    private readonly integrationRepository: Repository<Integration>,
    private readonly logger: Logger,
  ) {}

  async list(userId: string) {
    const user = await this.userRepository.findOne({
      where: { uid: userId },
      relations: ['friends', 'friends.integrations'],
      select: [],
    });
    return user?.friends ?? [];
  }

  async add(ownerId: number, options: AddFriendDto) {
    const values = Array.from(Object.values(options)).map(String);

    const integration = await this.integrationRepository.findOne({
      where: { providerId: In(values) },
      relations: ['user'],
    });

    if (integration) {
      await this.userRepository
        .query(
          'INSERT INTO friends ("owner_id", "friend_id") VALUES ((SELECT id FROM users WHERE id = $1), $2)',
          [ownerId, integration.user.id],
        )
        .catch((error) => {
          this.logger.error(
            { message: 'Error while adding friend', error: error.message },
            error.stack,
            'FriendsService',
          );
        });
    }
  }

  async remove(id: number, friendId: string) {
    await this.userRepository.query(
      `DELETE FROM friends WHERE owner_id = $1 AND friend_id = (SELECT id FROM users WHERE uid = $2)`,
      [id, friendId],
    );
  }
}
