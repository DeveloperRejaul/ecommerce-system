import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';

// handle all environments loaded or not loaded
const requireEnv = [
  'DATABASE_URL',
  'PORT',
  'JWT_SECRET',
  'ORIGIN',
  'EMAIL_HOST',
  'POST',
  'EMAIL_USERNAME',
  'EMAIL_PASSWORD',
];
const allEnv = new Set(Object.keys(process.env));

const envExists = requireEnv.every((e) => allEnv.has(e));
if (!envExists) {
  console.log('Environment variable not found');
  process.exit(1);
}
console.log('Environment variable successfully loaded');

async function bootstrap() {
  const port = parseInt(process.env.SERVER_PORT, 10) || 4000;

  // create upload directory if not created
  const path = join(__dirname, '/upload');
  if (!existsSync(path)) { await mkdir(path); }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: process.env.ORIGIN.split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  });
  await app.listen(port);
  console.log(`Server running on: http://localhost:${port}`);
}
bootstrap();
