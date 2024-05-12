import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from 'src/models/answer.entity';
import { Post } from 'src/models/post.entity';
import { ClerkModule } from 'src/clerk/clerk.module';
import { ClerkService } from 'src/clerk/clerk.service';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Post]), ClerkModule],
  controllers: [AnswersController],
  providers: [AnswersService, ClerkService],
})
export class AnswersModule {}
