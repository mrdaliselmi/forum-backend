import { Controller, Get, Inject, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ClerkService } from './clerk/clerk.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(ClerkService) private readonly clerkService: ClerkService,
  ) {}

  @Get()
  async getHello(@Req() request: Request) {
    return await this.clerkService.validateToken(request);
  }
}
