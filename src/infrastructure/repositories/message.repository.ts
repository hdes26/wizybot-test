import { IMessageRepository } from '@domain/repositories';
import { Message } from '@infrastructure/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class MessageRepository
  extends BaseRepository<Message>
  implements IMessageRepository
{
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {
    super(messageRepository);
  }
}
