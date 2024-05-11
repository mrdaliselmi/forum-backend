import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/models/post.entity';
import { ILike, In, Repository } from 'typeorm';
import { UserInfo } from 'src/interfaces/user-info.interface';
import { Tag } from 'src/models/tag.entity';
import { FindAllParams } from 'src/interfaces/find-all.interface';
import { paginate } from 'src/helpers/paginate';
import { isCreator } from 'src/helpers/isCreator';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
  ) {}

  async create(createPostDto: CreatePostDto, user: UserInfo) {
    const { tags: tagNames, ...postData } = createPostDto;
    let allTags = [];
    if (tagNames?.length > 0) {
      const existingTags = await this.tagRepository.find({
        where: { name: In(tagNames) },
      });
      const newTagNames = tagNames.filter(
        (tagName) => !existingTags.some((tag) => tag.name === tagName),
      );
      const newTags = newTagNames.map((tagName) =>
        this.tagRepository.create({ name: tagName }),
      );
      await this.tagRepository.save(newTags);
      allTags = [...existingTags, ...newTags];
    }
    const post = this.postRepository.create({
      ...postData,
      creatorId: user.user_id,
      tags: allTags,
    });
    await this.postRepository.save(post);
    return post;
  }

  async findAll(params: FindAllParams) {
    if (params.search) {
      return await paginate(this.postRepository, params, [
        { title: ILike(`%${params.search}%`) },
        { content: ILike(`%${params.search}%`) },
      ]);
    }
    return await paginate(this.postRepository, params, {});
  }

  async findOne(id: number) {
    return await this.postRepository.findOne({
      where: { id: id },
      relations: ['tags', 'answers'],
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: UserInfo) {
    const post = await this.postRepository.findOne({
      where: { id: id },
      relations: ['tags'],
    });
    if (!post) throw new NotFoundException('post not found');
    if (!isCreator(post, user.user_id)) {
      throw new UnauthorizedException('you are not the creator of this post');
    }
    const { tags: tagNames, ...postData } = updatePostDto;
    console.log(postData);
    if (tagNames?.length > 0) {
      const existingTags = await this.tagRepository.find({
        where: { name: In(tagNames) },
      });
      const newTagNames = tagNames.filter(
        (tagName) => !existingTags.some((tag) => tag.name === tagName),
      );
      const newTags = newTagNames.map((tagName) =>
        this.tagRepository.create({ name: tagName }),
      );
      await this.tagRepository.save(newTags);
      const allTags = [...existingTags, ...newTags];
      post.tags = allTags;
    }
    return await this.postRepository.save({ ...post, ...postData });
  }

  async remove(id: number, user: UserInfo) {
    const post = await this.postRepository.findOne({
      where: { id: id },
    });
    if (!post) throw new NotFoundException('post not found');
    if (!isCreator(post, user.user_id)) {
      throw new UnauthorizedException('you are not the creator of this post');
    }
    return await this.postRepository.softDelete({ id: id });
  }
}