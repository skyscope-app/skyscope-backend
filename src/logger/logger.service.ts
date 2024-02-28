import { name, version } from "@/../package.json";
import { Configuration } from "@/configurations/configuration";
import { Inject, LoggerService, LogLevel } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import * as winston from "winston";

export enum Severity {
  DEFAULT = "DEFAULT",
  DEBUG = "DEBUG",
  INFO = "INFO",
  NOTICE = "NOTICE",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
  ALERT = "ALERT",
  EMERGENCY = "EMERGENCY",
}

export class InternalLogger implements LoggerService {
  private currentLogLevels = ["log", "error", "warn", "debug", "verbose"];
  private redactedContexts: Array<string> = ["NestFactory", "RouterExplorer", "RoutesResolver", "InstanceLoader", "NestApplication"];

  private context?: string;

  private winston: winston.Logger;

  constructor(@Inject(Configuration) private readonly configuration: Configuration, private readonly cls: ClsService) {
    this.winston = winston.createLogger({
      format: winston.format.json(), defaultMeta: { name, version }, transports: [new winston.transports.Console()]
    });
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes("log")) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {
    }

    this.winston.info({
      message,
      context: optionalParams[0] ?? this.context,
      severity: Severity.INFO,
      time: new Date(),
      requestId,
      version: this.configuration.APP_VERSION
    });
  }

  error(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes("error")) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {
    }

    let stackTrace;

    if (optionalParams.length == 2) {
      stackTrace = optionalParams[0].stack || optionalParams[0];
    }

    this.winston.error({
      message,
      context: optionalParams && optionalParams.length > 0 ? optionalParams.pop() : this.context,
      severity: Severity.ERROR,
      time: new Date(),
      requestId,
      stackTrace,
      version: this.configuration.APP_VERSION
    });
  }

  warn(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes("warn")) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {
    }

    this.winston.warn({
      message,
      context: optionalParams[0] ?? this.context,
      severity: Severity.WARNING,
      time: new Date(),
      requestId,
      version: this.configuration.APP_VERSION
    });


  }

  debug?(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes("debug")) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {
    }

    this.winston.debug({
      message,
      context: optionalParams[0] ?? this.context,
      severity: Severity.DEBUG,
      time: new Date(),
      requestId,
      version: this.configuration.APP_VERSION
    });
  }

  verbose?(message: any, ...optionalParams: any[]) {
    if (!this.currentLogLevels.includes("verbose")) return;
    if (!this.shouldDisplayContext(optionalParams)) return;

    let requestId: string | undefined;

    try {
      requestId = this.cls.getId();
    } catch {
    }

    this.winston.verbose({
      message: message,
      context: optionalParams[0] ?? this.context,
      severity: Severity.INFO,
      time: new Date(),
      requestId,
      version: this.configuration.APP_VERSION
    });
  }

  setLogLevels?(levels: LogLevel[]) {
    this.currentLogLevels = levels;
  }

  private shouldDisplayContext(optionalParams: any[]) {
    return !this.redactedContexts.includes(optionalParams[0]);
  }
}
