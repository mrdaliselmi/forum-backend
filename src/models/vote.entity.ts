import { Column, Entity, ManyToOne } from 'typeorm';
import { GenericEntity } from './shared/generic.entity';
import { Post } from './post.entity';
import { Answer } from './answer.entity';

@Entity()
export class Vote extends GenericEntity {
  @Column()
  userId: string;

  @Column({ type: 'enum', enum: ['up', 'down'] })
  type: string;

  @ManyToOne(() => Post, (post) => post.votes)
  post: Post;

  @ManyToOne(() => Answer, (post) => post.votes)
  answer: Answer;
}
