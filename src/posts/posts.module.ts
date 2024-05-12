import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from 'src/models/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/models/tag.entity';
import { ClerkModule } from 'src/clerk/clerk.module';
import { ClerkService } from 'src/clerk/clerk.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag]), ClerkModule],
  controllers: [PostsController],
  providers: [PostsService, ClerkService],
})
export class PostsModule {}
