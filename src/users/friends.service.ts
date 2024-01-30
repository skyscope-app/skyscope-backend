import { User } from '@/users/domain/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  list(userId: string) {
    return this.userRepository
      .findOne({
        where: {
          id: userId,
        },
        relations: ['friends'],
      })
      .then((user) => user?.friends ?? []);
  }

  async add(ownerId: string, friendId: string) {
    await this.userRepository.query(
      'INSERT INTO friends ("ownerId", "friendId") VALUES ((SELECT iid FROM users WHERE id = $1), (SELECT iid FROM users WHERE id = $2))',
      [ownerId, friendId],
    );
  }
}
