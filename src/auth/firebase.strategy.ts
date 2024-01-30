import { CacheService } from '@/cache/cache.service';
import { Configuration } from '@/configurations/configuration';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { auth } from 'firebase-admin';
import { ClsService } from 'nestjs-cls';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import { UsersService } from '@/users/services/users.service';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  public constructor(
    private readonly logger: Logger,
    private readonly clsService: ClsService,
    private readonly cacheService: CacheService,
    @Inject(Configuration) private readonly configuration: Configuration,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('bearer'),
      ]),
      passReqToCallback: true,
    });
  }

  async validate(request: any, token: string) {
    try {
      const data = await this.cacheService.handle(
        token,
        async () => {
          const uid = await this.validateUser(token);
          const authUser = await this.authService.findByUid(uid);

          if (!authUser) {
            return null;
          }

          if (!authUser.email) {
            this.logger.error({ message: 'user has no email', uid });
            return null;
          }

          const user = await this.userService.findByAuthenticationID(uid);

          if (!user) {
            return await this.userService
              .create(authUser.email, uid)
              .then((user) => ({ user, authUser }));
          }

          return { user, authUser };
        },
        15 * 60,
      );

      if (!data) {
        return false;
      }

      this.clsService.set('user', data.user);
      this.clsService.set('auth_user', data.authUser);
      return data;
    } catch (e: any) {
      this.logger.warn({ message: 'error to authenticate', error: e });
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
    return parsedToken['sub'];
  }
}
