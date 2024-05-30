import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
  Patch,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserInfo } from 'src/interfaces/user-info.interface';
import { ClerkAuthGuard } from 'src/guards/clerk-auth.guard';
import { FindAllParams } from 'src/interfaces/find-all.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(ClerkAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: UserInfo) {
    return this.postsService.create(createPostDto, user);
  }

  @UseGuards(ClerkAuthGuard)
  @Patch('upvote/:id')
  upvote(@Param('id') id: string, @CurrentUser() user: UserInfo) {
    return this.postsService.upVote(+id, user);
  }

  @UseGuards(ClerkAuthGuard)
  @Patch('downvote/:id')
  downVote(@Param('id') id: string, @CurrentUser() user: UserInfo) {
    return this.postsService.downVote(+id, user);
  }

  @Get()
  findAll(@Query() params: FindAllParams) {
    return this.postsService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(ClerkAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: UserInfo,
  ) {
    return this.postsService.update(+id, updatePostDto, user);
  }

  @UseGuards(ClerkAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserInfo) {
    return this.postsService.remove(+id, user);
  }
}
