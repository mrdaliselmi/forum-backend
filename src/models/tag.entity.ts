import { Column, Entity, ManyToMany } from 'typeorm';
import { GenericEntity } from './shared/generic.entity';
import { Post } from './post.entity';

@Entity()
export class Tag extends GenericEntity {
  @Column()
  name: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
