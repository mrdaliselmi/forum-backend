import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  host: process.env.RABBITMQ_HOST,
  notifQueue: process.env.RABBITMQ_NOTIF_QUEUE,
  durable: process.env.RABBITMQ_DURABLE,
}));
