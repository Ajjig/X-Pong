import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
// import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
