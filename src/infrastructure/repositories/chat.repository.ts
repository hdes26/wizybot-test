import { IChatRepository } from '@domain/repositories';
import { Chat } from '@infrastructure/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class ChatRepository
  extends BaseRepository<Chat>
  implements IChatRepository
{
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
  ) {
    super(chatRepository);
  }
}
