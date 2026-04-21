import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim());

  app.enableCors({
    origin: origins.length === 1 && origins[0] === '*' ? true : origins,
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: false }),
  );

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend running on :${port}`);
}
bootstrap();
