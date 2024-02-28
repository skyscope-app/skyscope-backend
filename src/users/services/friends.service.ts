import { User } from '@/users/domain/user.entity';
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileOptionsDto } from '@/users/dtos/user-update.dto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly logger: Logger,
  ) {}

  async list(userId: string) {
    const user = await this.userRepository.findOne({
      where: { uid: userId },
      relations: ['friends'],
      select: [],
    });
    return user?.friends ?? [];
  }

  async add(ownerId: number, options: ProfileOptionsDto) {
    const user = await this.userRepository.findOne({ where: options });

    if (user) {
      await this.userRepository
        .query(
          'INSERT INTO friends ("owner_id", "friend_id") VALUES ((SELECT id FROM users WHERE id = $1), $2)',
          [ownerId, user.id],
        )
        .catch((error) => {
          this.logger.error({message: 'Error while adding friend', error: error.message}, error.stack, 'FriendsService');
        });
    }
  }
}
