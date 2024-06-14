import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { UserInfo } from 'src/interfaces/user-info.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/models/answer.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/models/post.entity';
import { isCreator } from 'src/helpers/isCreator';
import { paginate } from 'src/helpers/paginate';
import { FindAllParams } from 'src/interfaces/find-all.interface';
import { Vote } from 'src/models/vote.entity';
import { ClerkService } from 'src/clerk/clerk.service';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer) private answerRepository: Repository<Answer>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Vote) private voteRepository: Repository<Vote>,
    private readonly clerkService: ClerkService,
  ) {}

  async create(
    postId: number,
    createAnswerDto: CreateAnswerDto,
    user: UserInfo,
  ) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    const answer = this.answerRepository.create({
      ...createAnswerDto,
      post,
      creatorId: user.user_id,
    });
    return await this.answerRepository.save(answer);
  }

  async findAll(postId: number, params: FindAllParams) {
    const result = await paginate(
      this.answerRepository,
      params,
      {
        post: { id: postId },
      },
      ['votes'],
    );
    const answers = [];
    for (const answer of result[0]) {
      answers.push({
        ...answer,
        user: await this.clerkService.findOne(answer.creatorId),
      });
    }
    result[0] = answers;
    return result;
  }

  async findOne(id: number) {
    const answer = await this.answerRepository.findOne({
      where: { id: id },
      relations: ['post', 'votes'],
    });
    if (!answer) throw new NotFoundException('Answer not found');
    const result = {
      ...answer,
      user: await this.clerkService.findOne(answer.creatorId),
    };
    return result;
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto, user: UserInfo) {
    const answer = await this.answerRepository.findOne({ where: { id: id } });
    if (!answer) throw new NotFoundException('Answer not found');
    if (!isCreator(answer, user.user_id))
      throw new UnauthorizedException('Unauthorized');
    return await this.answerRepository.save({
      ...answer,
      ...updateAnswerDto,
    });
  }

  async remove(id: number, user: UserInfo) {
    const answer = await this.answerRepository.findOne({ where: { id: id } });
    if (!answer) throw new NotFoundException('Answer not found');
    if (!isCreator(answer, user.user_id))
      throw new UnauthorizedException('Unauthorized');
    return await this.answerRepository.softDelete(id);
  }

  async upVote(id: number, user: UserInfo) {
    const answer = await this.answerRepository.findOne({ where: { id: id } });
    if (!answer) throw new NotFoundException('Answer not found');
    const vote = this.voteRepository.create({
      userId: user.user_id,
      answer: answer,
      type: 'up',
    });
    await this.voteRepository.save(vote);
    return;
  }

  async downVote(id: number, user: UserInfo) {
    const answer = await this.answerRepository.findOne({ where: { id: id } });
    if (!answer) throw new NotFoundException('Answer not found');
    const vote = this.voteRepository.create({
      userId: user.user_id,
      answer: answer,
      type: 'down',
    });
    await this.voteRepository.save(vote);
    return;
  }
}
