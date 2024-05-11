import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export abstract class FindAllParams {
  @IsOptional()
  @Transform(({ value }) => {
    const numberValue = parseInt(value, 10);
    return isNaN(numberValue) ? 1 : Math.max(numberValue, 1);
  })
  @IsNumber({}, { message: ' page should be a number' })
  @Min(1, { message: ' limit should be greater than 0' })
  page: number;

  @Transform(({ value }) => {
    const numberValue = parseInt(value, 10);
    return isNaN(numberValue) ? 10 : Math.max(numberValue, 1);
  })
  @IsOptional()
  @IsNumber({}, { message: ' limit should be a number ' })
  @Min(1, { message: ' limit should be greater than 0' })
  limit: number;

  @IsOptional()
  orderBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;

  @IsString()
  @IsOptional()
  search?: string;
}
