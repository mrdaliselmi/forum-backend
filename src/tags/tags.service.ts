import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'src/helpers/paginate';
import { FindAllParams } from 'src/interfaces/find-all.interface';
import { Tag } from 'src/models/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  async findAll(params: FindAllParams) {
    return await paginate(this.tagRepository, params, {});
  }

  async findOne(name: string) {
    return await this.tagRepository.findOne({ where: { name: name } });
  }

  async getPostsByTag(name: string) {
    return await this.tagRepository.find({
      relations: ['posts'],
      where: { name: name },
    });
  }
}
