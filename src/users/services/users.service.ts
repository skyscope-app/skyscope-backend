import { AuthService } from '@/auth/auth.service';
import { User, UserOptions } from '@/users/domain/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {}

  create(
    email: string,
    authenticationId: string,
    options?: UserOptions,
  ): Promise<User> {
    const user = new User(email, authenticationId, options);
    return this.userRepository.save(user).then((user) => this.enrichUser(user));
  }

  findByAuthenticationID(authenticationId: string) {
    return this.userRepository.findOneBy({ authenticationId }).then((user) => {
      if (user) {
        return this.enrichUser(user);
      }
    });
  }

  async updateProfile(user: User, options: UserOptions) {
    user.setOptions(options);
    await this.userRepository.save(user);
  }

  async enrichUser(user: User) {
    const authUser = await this.authService.findByUid(user.authenticationId);
    user.setPhoto(authUser?.photoURL ?? '');
    user.setName(authUser?.displayName ?? '');
    return user;
  }
}
