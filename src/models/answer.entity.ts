import { Column, Entity, ManyToOne } from 'typeorm';
import { GenericEntity } from './shared/generic.entity';
import { Post } from './post.entity';

@Entity()
export class Answer extends GenericEntity {
  @Column()
  creatorId: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  upVotes: number;

  @Column({ default: 0 })
  downVotes: number;

  @ManyToOne(() => Post, (post) => post.answers)
  post: Post;
}
