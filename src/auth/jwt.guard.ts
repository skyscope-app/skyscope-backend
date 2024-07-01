import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('firebase') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticationOptional = this.reflector.get<boolean>(
      'isAuthenticationOptional',
      context.getHandler(),
    );

    try {
      const data = await super.canActivate(context);

      return data as any;
    } catch (e) {
      if (isAuthenticationOptional) {
        return true;
      }

      throw new UnauthorizedException();
    }
  }
}
