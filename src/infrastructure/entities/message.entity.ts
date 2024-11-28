import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './shared/base.entity';
import { Chat } from './chat.entity';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @Column({ length: 50 })
  sender: string;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;
}
