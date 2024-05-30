import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { GenericEntity } from './shared/generic.entity';
import { Answer } from './answer.entity';
import { Tag } from './tag.entity';
import { Vote } from './vote.entity';

@Entity()
export class Post extends GenericEntity {
  @Column()
  creatorId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  views: number;

  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  @OneToMany(() => Answer, (answer) => answer.post)
  answers: Answer[];

  @ManyToMany(() => Tag, (tag) => tag.posts, { cascade: true })
  @JoinTable()
  tags: Tag[];
}
