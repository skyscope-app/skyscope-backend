import { User } from '@/users/domain/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileOptionsDto } from '@/users/dtos/user-update.dto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async list(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
      select: [],
    });
    return user?.friends ?? [];
  }

  async add(ownerId: string, options: ProfileOptionsDto) {
    const user = await this.userRepository.findOne({ where: options });

    if (user) {
      await this.userRepository
        .query(
          'INSERT INTO friends ("ownerId", "friendId") VALUES ((SELECT iid FROM users WHERE id = $1), $2)',
          [ownerId, user.iid],
        )
        .catch(() => {});
    }
  }
}
