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
import cookieParser from 'cookie-parser';
import express from 'express';
import admin from 'firebase-admin';
import { copyFile, mkdir } from 'fs/promises';
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

async function copyFiles() {
  const data = [
    {
      from: './private_data/ICAO_Airlines.txt',
      to: '/tmp/skyscope/ICAO_Airlines.txt',
    },
    { from: './private_data/vatspy.json', to: '/tmp/skyscope/vatspy.json' },
    { from: './private_data/current.s3db', to: '/tmp/skyscope/current.s3db' },
    { from: './private_data/outdated.s3db', to: '/tmp/skyscope/outdated.s3db' },
  ];

  await mkdir('/tmp/skyscope', { recursive: true }).catch();

  await Promise.all(data.map((d) => copyFile(d.from, d.to)));
}

async function bootstrap() {
  admin.initializeApp();

  await validateConfiguration(Configuration);

  await copyFiles()

  const app = await NestFactory.create(AppModule);

  clsService = app.select(AppModule).get(ClsService);

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
      'https://skyscope-nine.vercel.app'
    ],
    credentials: true,
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
