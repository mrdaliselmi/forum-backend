import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  prefix: process.env.API_PREFIX,
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.APP_PORT,
  cors: {
    origin: [process.env.URL_FRONT],
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Content-Type',
      'Authorization',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
  url: {
    frontend: process.env.URL_FRONT,
  },
}));
