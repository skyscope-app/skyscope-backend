import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserOptions } from '@/users/domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly logger: Logger,
  ) {}

  create(
    email: string,
    authenticationId: string,
    options?: UserOptions,
  ): Promise<User> {
    const user = new User(email, authenticationId, options);
    return this.userRepository.save(user);
  }

  findByAuthenticationID(authenticationId: string) {
    return this.userRepository.findOneBy({ authenticationId });
  }

  async updateProfile(user: User, options: UserOptions) {
    user.setOptions(options);
    await this.userRepository.save(user);
  }
}
