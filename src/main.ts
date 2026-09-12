import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigEnum } from './common/config';

const validationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
});

async function bootstrap() {
  const logger = new Logger(AppModule.name);

  const context = await NestFactory.createApplicationContext(AppModule);

  const configService = context.get(ConfigService);

  const amqpUrls = configService.get<string[]>(ConfigEnum.AMQP_SERVERS);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: amqpUrls,
        queue: 'mailing_queue',
        queueOptions: {
          durable: true,
        },
        noAck: false,
      },
    },
  );

  app.useGlobalPipes(validationPipe);

  await app.listen();

  logger.log('Mail Microservice is running');
}
bootstrap();
