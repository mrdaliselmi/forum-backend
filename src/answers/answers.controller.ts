import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { ClerkAuthGuard } from 'src/guards/clerk-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserInfo } from 'src/interfaces/user-info.interface';
import { FindAllParams } from 'src/interfaces/find-all.interface';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @UseGuards(ClerkAuthGuard)
  @Post(':PostId')
  create(
    @Body() createAnswerDto: CreateAnswerDto,
    @Param('PostId') id: string,
    @CurrentUser() user: UserInfo,
  ) {
    return this.answersService.create(+id, createAnswerDto, user);
  }

  @Get('post/:PostId')
  findAll(@Param('PostId') id: string, @Query() params: FindAllParams) {
    return this.answersService.findAll(+id, params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.answersService.findOne(+id);
  }

  @UseGuards(ClerkAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @CurrentUser() user: UserInfo,
  ) {
    return this.answersService.update(+id, updateAnswerDto, user);
  }

  @UseGuards(ClerkAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserInfo) {
    return this.answersService.remove(+id, user);
  }

  @UseGuards(ClerkAuthGuard)
  @Patch('upvote/:id')
  upVote(@Param('id') id: string, @CurrentUser() user: UserInfo) {
    return this.answersService.upVote(+id, user);
  }

  @UseGuards(ClerkAuthGuard)
  @Patch('downvote/:id')
  downVote(@Param('id') id: string, @CurrentUser() user: UserInfo) {
    return this.answersService.downVote(+id, user);
  }
}
