import { IBotRepository } from '@domain/repositories';
import { Bot } from '@infrastructure/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class BotRepository
  extends BaseRepository<Bot>
  implements IBotRepository
{
  constructor(
    @InjectRepository(Bot) private readonly botRepository: Repository<Bot>,
  ) {
    super(botRepository);
  }
}
