import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AccountStatus, User } from '@/users/domain/user.entity';

@Injectable()
export class NoWaitListGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const user = request.user.user as User;

    if (user.accountStatus !== AccountStatus.Active) {
      return false;
    }

    return true;
  }
}
