import {
  Configuration,
  validateConfiguration,
} from '@/configurations/configuration';
import { LoggingInterceptor } from '@/logger/logger.interceptor';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import helmet from 'helmet';
import { ClsService } from 'nestjs-cls';
import { AppModule } from './app.module';

export let clsService: ClsService;

function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addServer(`http://localhost:${process.env.PORT ?? 8080}`)
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
  await validateConfiguration(Configuration);

  const app = await NestFactory.create(AppModule);

  clsService = app.select(AppModule).get(ClsService);

  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.use(helmet());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({ limit: '32mb' }));
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  app.setGlobalPrefix('/api/v1');
  app.useGlobalInterceptors(app.select(AppModule).get(LoggingInterceptor));
  app.useGlobalPipes(new ValidationPipe());

  setupSwagger(app);

  await app.listen(Number(process.env.PORT ?? 8080));
}
bootstrap();
