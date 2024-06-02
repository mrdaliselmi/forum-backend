import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @MinLength(20, { message: 'Comment must be at least 20 characters long' })
  @MaxLength(500, { message: 'Comment must be less than 200 characters long' })
  content: string;
}
