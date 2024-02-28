import { AuthService } from '@/auth/auth.service';
import { User, UserOptions } from '@/users/domain/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheService } from '@/cache/cache.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly logger: Logger,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {}

  async create(
    email: string,
    authenticationId: string,
    options?: UserOptions,
  ): Promise<User> {
    const user = await this.userRepository.save(
      new User(email, authenticationId, options),
    );
    return await this.enrichUser(user);
  }

  async findByAuthenticationID(authenticationId: string) {
    const user = await this.userRepository.findOneBy({ authenticationId });
    if (user) {
      return this.enrichUser(user);
    }
  }

  async updateProfile(user: User, options: UserOptions) {
    user.setOptions(options);
    await this.userRepository.save(user);
    await this.cacheService.invalidate(user.authenticationId);
  }

  async enrichUser(user: User) {
    const authUser = await this.authService.findByUid(user.authenticationId);
    user.setPhoto(authUser?.photoURL ?? '');
    user.setName(authUser?.displayName ?? '');
    return user;
  }
}
