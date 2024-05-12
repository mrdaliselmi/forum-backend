import { registerAs } from '@nestjs/config';

export default registerAs('clerk', () => ({
  secretKey: process.env.CLERK_SECRET_KEY,
  publicKey: process.env.CLERK_PUBLIC_KEY,
}));
