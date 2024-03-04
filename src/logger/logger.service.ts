import { name, version } from '@/../package.json';
import { Configuration } from '@/configurations/configuration';
import { Inject, LoggerService, LogLevel } from '@nestjs/common';
import * as winston from 'winston';
import { MessageBuilder, Webhook } from 'minimal-discord-webhook-node';
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

  private winston: winston.Logger;
  private webhook: Webhook;
  private gcpRegisterLog = `https://console.cloud.google.com/logs/query;query=resource.type%20%3D%20%22cloud_run_revision%22%0Aresource.labels.service_name%20%3D%20%22#SERVICE_NAME#%22%0Aresource.labels.location%20%3D%20%22us-central1%22%0AjsonPayload.requestId%3D%22#requestId#%22%0A%20severity%3E%3DDEFAULT;timeRange=PT5M;cursorTimestamp=#cursorTimestamp#?authuser=1&project=skyscopeapp`;

  constructor(
    @Inject(Configuration) private readonly configuration: Configuration,
    private readonly cls: ClsService,
  ) {
    this.webhook = new Webhook(this.configuration.DISCORD_WEBHOOK_URL);

    this.winston = winston.createLogger({
      format: winston.format.json(),
      defaultMeta: { name, version },
      transports: [new winston.transports.Console()],
    });
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

    this.winston.info({
      message,
      context: optionalParams[0] ?? this.context,
      severity: Severity.INFO,
      time: new Date(),
      requestId,
      version: this.configuration.APP_VERSION,
    });
  }

  async error(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes('error')) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {}

    console.log(this.cls.get());

    let stackTrace;

    if (optionalParams.length == 2) {
      stackTrace = optionalParams[0].stack || optionalParams[0];
    }

    const context =
      optionalParams && optionalParams.length > 0
        ? optionalParams.pop()
        : this.context;

    const webhook = new MessageBuilder()
      .setTitle(`ERROR`)
      .addField('Context', `${context}`, true)
      .addField('RequestId', `${requestId}`, true)
      .addField('Version', `${this.configuration.APP_VERSION}`, true)
      .addField('StackTrace', `${stackTrace || 'No stack trace'}`, true)
      .setColor('#ED4337' as any)
      .setDescription(
        `This is an error message at ${this.configuration.SERVICE_NAME} service`,
      )
      .addField(
        'log',
        `[Click here to see log](${this.gcpRegisterLog
          .replace('#requestId#', requestId!)
          .replace('#cursorTimestamp#', new Date().toISOString())
          .replace('#SERVICE_NAME#', this.configuration.SERVICE_NAME)} )`,
      )
      .setTimestamp();

    await this.webhook.send(webhook);

    this.winston.error({
      message,
      context,
      severity: Severity.ERROR,
      time: new Date(),
      requestId,
      stackTrace,
      version: this.configuration.APP_VERSION,
    });
  }

  warn(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes('warn')) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {}

    this.winston.warn({
      message,
      context: optionalParams[0] ?? this.context,
      severity: Severity.WARNING,
      time: new Date(),
      requestId,
      version: this.configuration.APP_VERSION,
    });
  }

  debug?(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes('debug')) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {}

    this.winston.debug({
      message,
      context: optionalParams[0] ?? this.context,
      severity: Severity.DEBUG,
      time: new Date(),
      requestId,
      version: this.configuration.APP_VERSION,
    });
  }

  verbose?(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes('verbose')) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {}

    this.winston.verbose({
      message: message,
      context: optionalParams[0] ?? this.context,
      severity: Severity.INFO,
      time: new Date(),
      requestId,
      version: this.configuration.APP_VERSION,
    });
  }

  setLogLevels?(levels: LogLevel[]) {
    this.currentLogLevels = levels;
  }

  private shouldDisplayContext(optionalParams: any[]) {
    return !this.redactedContexts.includes(optionalParams[0]);
  }
}
