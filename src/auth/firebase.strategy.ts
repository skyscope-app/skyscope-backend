import { AuthService } from '@/auth/auth.service';
import { CacheService } from '@/cache/cache.service';
import { Configuration } from '@/configurations/configuration';
import { AiracService } from '@/navdata/services/airac.service';
import { UsersService } from '@/users/services/users.service';
import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { auth } from 'firebase-admin';
import { ClsService } from 'nestjs-cls';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';

function extractJWTFromCookie(request: Request): string | null {
  const cookies = request.cookies;

  if (cookies && cookies['__Secure-access-token']) {
    return cookies['__Secure-access-token'];
  }

  return null;
}

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  public constructor(
    private readonly logger: Logger,
    private readonly clsService: ClsService,
    private readonly cacheService: CacheService,
    @Inject(Configuration) private readonly configuration: Configuration,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly airacService: AiracService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('bearer'),
        extractJWTFromCookie,
      ]),
      passReqToCallback: true,
    });
  }

  async validate(request: any, token: string) {
    try {
      const uid = this.getTokenUid(token);
      await this.validateUser(token);

      const data = await this.cacheService.handle(
        uid,
        async () => {
          const [authUser, user] = await Promise.all([
            this.authService.findByUid(uid),
            this.userService.findByAuthenticationID(uid),
          ]);

          if (!authUser) {
            return null;
          }

          if (!authUser.email) {
            this.logger.error({ message: 'user has no email', uid });
            return null;
          }

          if (!user) {
            const airacSubscription = await this.airacService.findOutdated();

            return await this.userService
              .create(authUser.email, uid)
              .then((user) => ({ user, authUser, airacSubscription }));
          }

          const airacSubscription = await this.airacService.findByUser(user);

          return { user, authUser, airacSubscription };
        },
        15 * 60,
      );

      if (!data) {
        return false;
      }

      if (!data.airacSubscription) {
        this.logger.error({ message: 'user has no airac subscription', uid });
        throw new InternalServerErrorException();
      }

      this.clsService.set('user', data.user);
      this.clsService.set('auth_user', data.authUser);
      this.clsService.set('airac_subscription', data.airacSubscription);
      return data;
    } catch (e: any) {
      if (e.name === ForbiddenException.name) {
        throw e;
      }
      this.logger.error('error to authenticate user', e);
    }
  }

  async validateUser(token: string) {
    if (this.configuration.ENVIRONMENT === 'local') {
      if (process.env.USER_ID) {
        return process.env.USER_ID;
      }

      const tokenUid = this.getTokenUid(token);

      return tokenUid;
    }

    const tokenUid = this.getTokenUid(token);

    const [tokenData, authUser] = await Promise.all([
      auth().verifyIdToken(token, true),
      auth().getUser(tokenUid),
    ]);

    if (authUser.disabled) {
      throw new Error('Account disabled by the administrator');
    }

    return tokenData.uid;
  }

  private getTokenUid(token: string) {
    const parsedToken = token
      .split('.')
      .slice(0, 2)
      .map((segment) =>
        JSON.parse(Buffer.from(segment, 'base64').toString('ascii')),
      )[1];
    return parsedToken['sub'] as string;
  }
}
