import { clsService } from '@/main';
import { CanActivate, UseGuards, createParamDecorator } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

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

export const Authenticated = (
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

export const AuthenticatedDriver = () => RequestData('driver')();
