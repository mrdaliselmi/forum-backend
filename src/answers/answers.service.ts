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

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer) private answerRepository: Repository<Answer>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
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
    return await paginate(this.answerRepository, params, {
      post: { id: postId },
    });
  }

  async findOne(id: number) {
    const answer = await this.answerRepository.findOne({
      where: { id: id },
      relations: ['post'],
    });
    if (!answer) throw new NotFoundException('Answer not found');
    return answer;
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

  async upVote(id: number) {
    const answer = await this.answerRepository.findOne({ where: { id: id } });
    if (!answer) throw new NotFoundException('Answer not found');
    return await this.answerRepository.save({
      ...answer,
      upVotes: answer.upVotes + 1,
    });
  }

  async downVote(id: number) {
    const answer = await this.answerRepository.findOne({ where: { id: id } });
    if (!answer) throw new NotFoundException('Answer not found');
    return await this.answerRepository.save({
      ...answer,
      downVotes: answer.downVotes + 1,
    });
  }
}
