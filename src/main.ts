import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { AppModule } from './infrastructure/modules/app.module';
import { ConfigService } from '@nestjs/config';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  const configService = app.get(ConfigService);

  const port = configService.get<number>('config.httpServer.port') || 14001;

  const project = 'wizybot-test';

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('/api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  const username = configService.get<string>('config.swagger.user');
  const password = configService.get<string>('config.swagger.password');

  app.use(
    `/api/v1/${project}/docs`,
    basicAuth({
      challenge: true,
      users: {
        [username]: password,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Prueba tecnica')
    .setDescription('Wizybot test')
    .addBasicAuth()
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`/api/v1/${project}/docs`, app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });

  await app.listen(port);

  logger.debug(`🧨 => [APP] ${project} is running on http://localhost:${port}`);
  logger.debug(
    `🥟 => [SWAGGER] is running on http://localhost:${port}/api/v1/${project}/docs`,
  );
}
bootstrap();
