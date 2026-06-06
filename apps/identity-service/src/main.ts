import { NestFactory } from '@nestjs/core';
import { IdentityServiceModule } from './identity-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  process.title = 'identity-service';
  const logger = new Logger('IdentityServiceBootstrap');
  const rmqURl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  const queue = process.env.IDENTITY_QUEUE || 'identity_queue';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    IdentityServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqURl],
        queue,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();
  await app.listen();
  logger.log(`Identity service (RMQ) is listening on queue ${queue}`);
}

void bootstrap();
