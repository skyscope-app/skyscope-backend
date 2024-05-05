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
    const [user, authUser] = await Promise.all([
      this.userRepository.save(new User(email, authenticationId, options)),
      this.authService.findByUid(authenticationId),
    ]);

    user.setName(authUser?.displayName ?? '');
    user.setPhoto(authUser?.photoURL ?? '');
    return user;
  }

  async findByAuthenticationID(authenticationId: string) {
    const [user, authUser] = await Promise.all([
      this.userRepository.findOne({
        where: { authenticationId },
        relations: ['integrations'],
      }),
      this.authService.findByUid(authenticationId),
    ]);

    if (user) {
      user.setName(authUser?.displayName ?? '');
      user.setPhoto(authUser?.photoURL ?? '');
      return user;
    }
  }

  async updateProfile(user: User, options: ProfileOptionsDto) {
    await this.authService.updateProfile(user, options);
    await this.userRepository.save(user);
    await this.cacheService.invalidate(user.authenticationId);
  }
}
