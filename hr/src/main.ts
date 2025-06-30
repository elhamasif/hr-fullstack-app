import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
dotenv.config();
console.log('💡 Raw .env DB_PORT:', process.env.DB_PORT);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
 app.enableCors({
  origin: 'http://localhost:3000', // Allow frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true, // If you're using cookies or Authorization headers
});
  app.use(
    '/payment/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );app.use(bodyParser.json());

  // 6.2.2 For all other routes, use the normal JSON parser
  app.use(bodyParser.json());
  await app.listen(process.env.PORT ?? 3001);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
