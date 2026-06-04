import { NestFactory } from '@nestjs/core';
import { JobServiceModule } from './job-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  process.title = 'job-service';
  const logger = new Logger('JobServiceBootstrap');
  const rmqURl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  const queue = process.env.JOB_QUEUE || 'job_queue';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    JobServiceModule,
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
  app.enableShutdownHooks();
  await app.listen();
  logger.log(`Job service (RMQ) is listening on queue ${queue}`);
}

void bootstrap();
