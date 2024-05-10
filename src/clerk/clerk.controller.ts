import { Controller, Get, Param, Query } from '@nestjs/common';
import { ClerkService } from './clerk.service';
import { PaginationOptions } from 'src/dtos/paginationParams.dto';

@Controller('clerk')
export class ClerkController {
  constructor(private readonly clerkService: ClerkService) {}
  @Get()
  findAll(@Query() options: PaginationOptions) {
    return this.clerkService.findAll(options);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clerkService.findOne(id);
  }
}
