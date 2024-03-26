import { User } from '@/users/domain/user.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { auth } from 'firebase-admin';

interface UserOptions {
  name?: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly logger: Logger) {}

  async updateProfile(user: User, options: UserOptions) {
    await auth().updateUser(user.authenticationId, {
      displayName: options.name,
    });
  }

  async findByUid(email: string) {
    try {
      const firebaseAuthUser = await auth().getUser(email);
      return firebaseAuthUser;
    } catch (e: any) {
      switch (true) {
        case !!e.status:
          throw e;
        case e.code === 'auth/user-not-found':
          return null;
        default:
          this.logger.error('Error to findUserByEmail', e, AuthService.name);
          throw new InternalServerErrorException();
      }
    }
  }
}
