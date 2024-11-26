import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './shared/base.entity';
import { Chat } from './chat.entity';
import { BotTypeEnum } from '@domain/enum';

@Entity()
export class Bot extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 200 })
  behavior: string;

  @Column({ type: 'enum', enum: BotTypeEnum })
  type: BotTypeEnum;

  @OneToMany(() => Chat, (chat) => chat.bot)
  chats: Chat[];
}
