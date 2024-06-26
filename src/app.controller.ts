import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ClerkService } from './clerk/clerk.service';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserInfo } from './interfaces/user-info.interface';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // @Inject(ClerkService) private readonly clerkService: ClerkService,
  ) {}
  @UseGuards(ClerkAuthGuard)
  @Get()
  async getHello(@CurrentUser() user: UserInfo) {
    return user;
  }
}
