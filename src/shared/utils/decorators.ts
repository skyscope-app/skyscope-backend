import { NoWaitListGuard } from '@/auth/no-wait-list.guard';
import { clsService } from '@/main';
import { User } from '@/users/domain/user.entity';
import {
  CanActivate,
  createParamDecorator,
  Header,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

export const DefaultStatusCodes = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const decorators = [
      ApiInternalServerErrorResponse({
        description: 'An error occurred while processing the request',
      }),
      ApiBadRequestResponse({
        description: 'The request is invalid',
      }),
      ApiNotFoundResponse({
        description: 'The required resource was not founded',
      }),
    ];

    decorators.forEach((decorator) =>
      decorator(target, propertyKey, descriptor),
    );
  };
};

export const WaitListAuthenticated = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  ...guards: (CanActivate | Function)[]
): MethodDecorator & ClassDecorator => {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    const decorators = [
      DefaultStatusCodes(),
      ApiUnauthorizedResponse({ description: 'The user is not authenticated' }),
      ApiForbiddenResponse({
        description: 'The user has no permission to use this resource',
      }),
      ApiBearerAuth(),
      UseGuards(...guards),
      UseGuards(AuthGuard('firebase'), ...guards),
      ApiBearerAuth('JWT-auth'),
    ];

    decorators.forEach((decorator) =>
      decorator(target, propertyKey as any, descriptor as any),
    );
  };
};

export const Authenticated = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  ...guards: (CanActivate | Function)[]
): MethodDecorator & ClassDecorator => {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    const decorators = [
      DefaultStatusCodes(),
      ApiUnauthorizedResponse({ description: 'The user is not authenticated' }),
      ApiForbiddenResponse({
        description: 'The user has no permission to use this resource',
      }),
      ApiBearerAuth(),
      UseGuards(...guards),
      UseGuards(AuthGuard('firebase'), NoWaitListGuard, ...guards),
      ApiBearerAuth('JWT-auth'),
    ];

    decorators.forEach((decorator) =>
      decorator(target, propertyKey as any, descriptor as any),
    );
  };
};

export const RequestData = (key: string) =>
  createParamDecorator(() => {
    const d = clsService.get(key);
    return d;
  });

export const AuthenticatedUser = createParamDecorator(() => {
  const d = clsService.get('user');
  return plainToInstance(User, d);
});

export const AiracSubscription = createParamDecorator(() => {
  const d = clsService.get('airac_subscription');
  return d;
});

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace cacheControl {
  export enum Directive {
    PUBLIC = 'public',
    PRIVATE = 'private',
    NO_CACHE = 'no-cache',
    ONLY_IF_CACHED = 'only-if-cached',
  }

  export interface Options {
    directive: Directive;
    maxAge: number;
  }

  export const CacheControl = (options: Options) => {
    return Header(
      'Cache-Control',
      `${options.directive}, max-age=${options.maxAge}`,
    );
  };
}
