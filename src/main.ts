import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { dirname } from 'path';
import { load } from 'js-yaml';

import { Logger } from './log/logging-service';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { serve, setup } from 'swagger-ui-express';

config();
const port = Number(process.env.PORT) || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    rawBody: true,
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));

  const doc = load(
    (
      await readFile(join(dirname(__dirname), 'doc', 'api.yaml'), 'utf-8')
    ).toString(),
  );
  app.use('/doc', serve, setup(doc));
  await app.listen(port);
}
bootstrap();
