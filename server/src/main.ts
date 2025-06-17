import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { v2 } from 'cloudinary';
import * as morgan from 'morgan';

// handle all environments loaded or not loaded
const requireEnv = [
  'JWT_SECRET',
  'ORIGIN',
  'EMAIL_HOST',
  'POST',
  'EMAIL_USERNAME',
  'EMAIL_PASSWORD',
  'COOKIE_KEY',
  'SERVER_PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASS',
  'DB_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'CLOUDINARY_CLOUD_NAME',
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
  const path = join(process.cwd(), 'upload');

  if (!existsSync(path)) await mkdir(path);

  // cloudinary file upload configure
  v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const app = await NestFactory.create(AppModule, {logger:['error', 'warn']});
  app.use(morgan('tiny'));
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: process.env.ORIGIN.split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());
  const config = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);
  console.log(`Server running on: http://localhost:${port}`);
}
bootstrap();