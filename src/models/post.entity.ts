import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { GenericEntity } from './shared/generic.entity';
import { Answer } from './answer.entity';
import { Tag } from './tag.entity';

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

  @Column({ default: 0 })
  upVotes: number;

  @Column({ default: 0 })
  downVotes: number;

  @OneToMany(() => Answer, (answer) => answer.post)
  answers: Answer[];

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
  tags: Tag[];
}
