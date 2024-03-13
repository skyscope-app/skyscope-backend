import {
  Configuration,
  EnvironmentConfiguration,
  getConfiguration,
  validateConfiguration,
} from '@/configurations/configuration';
import { MigrateUp } from '@/database/migrate';
import { LoggingInterceptor } from '@/logger/logger.interceptor';
import { InternalLogger } from '@/logger/logger.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as admin from 'firebase-admin';
import helmet from 'helmet';
import { ClsService } from 'nestjs-cls';
import { AppModule } from './app.module';

export let clsService: ClsService;

function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addServer(`http://localhost:${process.env.PORT ?? 8080}`, 'local')
    .addServer('https://api.skyscope.app', 'production')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'token',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  if (process.env.FUNCTIONS_CONTROL_API) {
    return;
  }

  await validateConfiguration(Configuration);

  const app = await NestFactory.create(AppModule);

  clsService = app.select(AppModule).get(ClsService);

  admin.initializeApp();
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.use(helmet());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({ limit: '32mb' }));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://skyscope.app',
      'https://www.skyscope.app',
    ],
  });
  app.setGlobalPrefix('/api/v1');
  app.useGlobalInterceptors(app.select(AppModule).get(LoggingInterceptor));
  app.useGlobalPipes(new ValidationPipe());

  const configuration = getConfiguration(Configuration);

  if (configuration.ENVIRONMENT === 'main') {
    app.useLogger(new InternalLogger(configuration, clsService));
  }

  await MigrateUp(
    EnvironmentConfiguration.POSTGRES_HOST,
    EnvironmentConfiguration.POSTGRES_USER,
    EnvironmentConfiguration.POSTGRES_PASSWORD,
    Number(EnvironmentConfiguration.POSTGRES_PORT),
    EnvironmentConfiguration.POSTGRES_DATABASE,
    EnvironmentConfiguration.ENVIRONMENT,
  );

  setupSwagger(app);

  await app.listen(Number(process.env.PORT ?? 8080));
}

bootstrap();
