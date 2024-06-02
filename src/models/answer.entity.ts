import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { GenericEntity } from './shared/generic.entity';
import { Post } from './post.entity';
import { Vote } from './vote.entity';

@Entity()
export class Answer extends GenericEntity {
  @Column()
  creatorId: string;

  @Column()
  content: string;

  @OneToMany(() => Vote, (vote) => vote.answer)
  votes: Vote[];

  @ManyToOne(() => Post, (post) => post.answers)
  post: Post;
}
