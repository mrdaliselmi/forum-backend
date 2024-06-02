import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/clerk-sdk-node';
import { PaginationOptions } from 'src/dtos/paginationParams.dto';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class ClerkService {
  private readonly clerk: any;

  constructor(private readonly configService: ConfigService) {
    this.clerk = createClerkClient({
      secretKey: this.configService.get('clerk.secretKey'),
    });
  }

  async findOne(userId: string) {
    return await this.clerk.users.getUser(userId);
  }

  async findAll(options?: PaginationOptions) {
    const limit = options?.limit || 10;
    const page = options?.page || 0;
    return await this.clerk.users.getUserList({
      limit: limit,
      offset: limit * page,
    });
  }

  async validateToken(req) {
    const publicKey = this.configService.get('clerk.publicKey');
    const token = req.headers?.authorization?.replace('Bearer ', '').trim();
    if (!token) {
      throw new HttpException('Unauthorized Exception', 401);
    }
    try {
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      });
      return decoded;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
