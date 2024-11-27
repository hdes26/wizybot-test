import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './shared/base.entity';
import { Bot } from './bot.entity';
import { Message } from './message.entity';

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, name: 'user_ip' })
  userIp: string;

  @ManyToOne(() => Bot, (bot) => bot.chats)
  bot: Bot;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
