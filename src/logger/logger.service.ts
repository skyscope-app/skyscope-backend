import { Configuration } from '@/configurations/configuration';
import { Inject, LoggerService, LogLevel } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

export enum Severity {
  DEFAULT = 'DEFAULT',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  NOTICE = 'NOTICE',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
  ALERT = 'ALERT',
  EMERGENCY = 'EMERGENCY',
}

export class InternalLogger implements LoggerService {
  private currentLogLevels = ['log', 'error', 'warn', 'debug', 'verbose'];
  private redactedContexts: Array<string> = [
    'NestFactory',
    'RouterExplorer',
    'RoutesResolver',
    'InstanceLoader',
    'NestApplication',
  ];

  private context?: string;

  constructor(
    @Inject(Configuration) private readonly configuration: Configuration,
    private readonly cls: ClsService,
  ) {}

  private shouldDisplayContext(optionalParams: any[]) {
    return !this.redactedContexts.includes(optionalParams[0]);
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes('log')) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {}

    console.log(
      JSON.stringify({
        message,
        context: optionalParams[0] ?? this.context,
        severity: Severity.INFO,
        time: new Date(),
        requestId,
        version: this.configuration.APP_VERSION,
      }),
    );
  }

  error(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes('error')) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {}

    let stackTrace;

    if (optionalParams.length == 2) {
      stackTrace = optionalParams[0].stack || optionalParams[0];
    }

    console.error(
      JSON.stringify({
        message,
        context:
          optionalParams && optionalParams.length > 0
            ? optionalParams.pop()
            : this.context,
        severity: Severity.ERROR,
        time: new Date(),
        requestId,
        stackTrace,
        version: this.configuration.APP_VERSION,
      }),
    );
  }

  warn(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes('warn')) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {}

    console.warn(
      JSON.stringify({
        message,
        context: optionalParams[0] ?? this.context,
        severity: Severity.WARNING,
        time: new Date(),
        requestId,
        version: this.configuration.APP_VERSION,
      }),
    );
  }

  debug?(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes('debug')) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {}

    console.debug(
      JSON.stringify({
        message,
        context: optionalParams[0] ?? this.context,
        severity: Severity.DEBUG,
        time: new Date(),
        requestId,
        version: this.configuration.APP_VERSION,
      }),
    );
  }

  verbose?(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes('verbose')) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {}

    console.debug(
      JSON.stringify({
        message: message,
        context: optionalParams[0] ?? this.context,
        severity: Severity.INFO,
        time: new Date(),
        requestId,
        version: this.configuration.APP_VERSION,
      }),
    );
  }

  setLogLevels?(levels: LogLevel[]) {
    this.currentLogLevels = levels;
  }
}
