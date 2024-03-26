import { AuthService } from '@/auth/auth.service';
import { CacheService } from '@/cache/cache.service';
import { FilesService } from '@/files/services/files.service';
import { User, UserOptions } from '@/users/domain/user.entity';
import { ProfileOptionsDto } from '@/users/dtos/user-update.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    private readonly filesService: FilesService,
  ) {}

  async updateProfilePhoto(user: User, file: Express.Multer.File) {
    const extension = file.originalname.split('.').pop();

    const { key } = await this.filesService.upload(
      `users/profile/${user.uid}.${extension}`,
      file,
    );

    const publicUrl = `https://static.skyscope.app/${key}`;

    await this.authService.updateProfile(user, { avatar: publicUrl });
    await this.cacheService.invalidate(user.authenticationId);
  }

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

  async updateProfile(user: User, options: ProfileOptionsDto) {
    await this.authService.updateProfile(user, options);
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
