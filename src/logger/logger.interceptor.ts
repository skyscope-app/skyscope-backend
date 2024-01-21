import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import redact from 'redact-object';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { v4 } from 'uuid';

type NotifiableType = 'CLIENT' | 'SERVER' | 'BOTH';

export const Notifiable = (type: NotifiableType = 'BOTH') =>
  SetMetadata('NOTIFIABLE', type);

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private validMethods = ['POST', 'PUT', 'DELETE', 'PATCH', 'GET'];
  private redactedKeys: string[] = ['authorization', 'paymentMethod', 'bearer'];
  private slack: any;
  private readonly logger: Logger = new Logger(LoggingInterceptor.name);

  constructor(private readonly reflector: Reflector) {}

  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  private redactData(data: Record<string, any>) {
    try {
      const keys = this.redactedKeys
        .map((key) => [
          key.toUpperCase(),
          key.toLowerCase(),
          this.capitalizeFirstLetter(key),
          key,
        ])
        .flatMap((k) => k);

      return redact(data, keys);
    } catch {
      return {};
    }
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    request.requestTime = new Date().getTime();

    if (!request.requestId) {
      request.requestId = v4();
    }

    const body: object = {};

    Object.assign(body, request.body);

    return next
      .handle()
      .pipe(
        tap(() => {
          const request = context.switchToHttp().getRequest();

          const response: Response = context.switchToHttp().getResponse();

          if (this.validMethods.includes(request.method)) {
            this.logger.log({
              path: request.route.path,
              method: request.method,
              params: request.params,
              query: this.redactData(request.query),
              user: request.user?.email,
              code: response.statusCode,
              processTime: new Date().getTime() - request.requestTime,
              requestTime: new Date(request.requestTime).toISOString(),
              body: this.redactData(body),
              headers: this.redactData(request.headers),
              requestId: request.requestId,
            });
          }
        }),
      )
      .pipe(
        catchError((error) => {
          const request = context.switchToHttp().getRequest();

          let responseBody: object | undefined;
          let statusCode: number;

          if (error.status) {
            statusCode = error.status;
          } else {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          }

          if (error.response) {
            responseBody = error.response;
          }

          this.logger.error(
            {
              path: request.route.path,
              method: request.method,
              params: request.params,
              query: this.redactData(request.query),
              user: request.user?.email,
              code: statusCode,
              processTime: new Date().getTime() - request.requestTime,
              requestTime: new Date(request.requestTime).toISOString(),
              error: error.message,
              stack: error.stack,
              body: this.redactData(body),
              headers: this.redactData(request.headers),
              requestId: request.requestId,
              responseBody: this.redactData(responseBody!),
            },
            error,
          );

          const notifiableType = this.reflector.get<NotifiableType>(
            'NOTIFIABLE',
            context.getHandler(),
          );

          return throwError(() => error);
        }),
      );
  }
}
