import { IsNumber, IsOptional } from 'class-validator';

export class PaginationOptions {
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsNumber()
  page: number;
}
