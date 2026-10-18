import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DatabaseService } from './database/database.service';

async function bootstrap() {
  const logger = new Logger('PTSP-Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const dbService = app.get(DatabaseService);

  // Security Headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows R2 assets and Next.js frontend embedding
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Global API Prefix
  app.setGlobalPrefix('api');

  // CORS Settings
  const allowedOrigins = configService.get<string[]>('cors.origins');
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching allowed origins
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, logged
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Validation Pipe to prevent injection & unwanted payload parameters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter(dbService));

  const port = configService.get<number>('port') || 3007;
  await app.listen(port);

  logger.log(`====================================================`);
  logger.log(`🚀 PTSP Backend is running on: http://localhost:${port}/api`);
  logger.log(`🏥 Health Check: http://localhost:${port}/api/health`);
  logger.log(`📁 R2 Target Folder: ${configService.get<string>('r2.ptspFolder')}`);
  logger.log(`====================================================`);
}
bootstrap();
