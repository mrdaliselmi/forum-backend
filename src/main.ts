import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('rabbitmq.host')],
      queue: configService.get<string>('rabbitmq.notifQueue'),
      prefetchCount: 1,
      persistent: true,
      noAck: false,
      queueOptions: {
        durable: configService.get<string>('rabbitmq.durable') === 'true',
      },
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      },
    },
  });
  app.enableCors(configService.get('app.cors'));
  app.setGlobalPrefix(configService.get('app.prefix'));
  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
  await app.listen(configService.get('app.port', '0.0.0.0'));
}
bootstrap();
