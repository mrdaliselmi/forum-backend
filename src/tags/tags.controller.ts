import { Controller, Get, Param, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { FindAllParams } from 'src/interfaces/find-all.interface';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll(@Query() params: FindAllParams) {
    return this.tagsService.findAll(params);
  }

  @Get('posts/:name')
  postsByTag(@Param('name') name: string) {
    return this.tagsService.getPostsByTag(name);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.tagsService.findOne(name);
  }
}
