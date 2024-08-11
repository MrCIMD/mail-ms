import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigEnum } from './config';

const validationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
});

async function bootstrap() {
  const logger = new Logger(AppModule.name);

  const context = await NestFactory.createApplicationContext(AppModule);

  const configService = context.get(ConfigService);

  const natsServers = configService.get<string[]>(ConfigEnum.NATS_SERVERS);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: natsServers,
      },
    },
  );

  app.useGlobalPipes(validationPipe);

  await app.listen();

  logger.log('Mail Microservice is running');
}
bootstrap();
