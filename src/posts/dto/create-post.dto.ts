import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(15, { message: 'Title must be at least 15 characters long' })
  title: string;

  @IsString()
  @MinLength(15, { message: 'Content must be at least 15 characters long' })
  @MaxLength(1000, { message: 'Content must be at most 300 characters long' })
  content: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, { message: 'Question can have at most 5 tags' })
  @IsString({ each: true })
  tags: string[];
}
