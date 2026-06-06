import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  process.title = 'api-gateway';
  const logger = new Logger('ApiGatewayBootstrap');
  const app = await NestFactory.create(ApiGatewayModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();
  const port = Number(process.env.API_GATEWAY_PORT) || 3000;
  await app.listen(port);
  logger.log(`Api Gateway running at port ${port}`);
}
void bootstrap();
