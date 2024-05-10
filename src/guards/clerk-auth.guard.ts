import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClerkService } from 'src/clerk/clerk.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly clerkService: ClerkService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.handleRequest(request);
  }

  async handleRequest(request) {
    const decoded = await this.clerkService.validateToken(request);
    if (decoded) {
      request.user = decoded;
      return true;
    }
    return false;
  }
}
