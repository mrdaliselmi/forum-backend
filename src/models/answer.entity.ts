import { Column, Entity, ManyToOne } from 'typeorm';
import { GenericEntity } from './shared/generic.entity';
import { Post } from './post.entity';

@Entity()
export class Answer extends GenericEntity {
  @Column()
  creatorId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => Post, (post) => post.answers)
  post: Post;
}
