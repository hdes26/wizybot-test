import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bot } from '@infrastructure/entities';
import { BotTypeEnum } from '@domain/enum';
import { IBotSeederUsecase } from '@domain/ports';

@Injectable()
export class BotSeederUsecase implements IBotSeederUsecase {
  private readonly logger = new Logger(BotSeederUsecase.name);

  constructor(
    @InjectRepository(Bot)
    private readonly botRepository: Repository<Bot>,
  ) {}

  async handle(): Promise<void> {
    try {
      const bots = await this.botRepository.find();
      if (bots.length > 0) {
        this.logger.debug('Bots already exist, skipping seeding');
        return;
      }

      const botData: Partial<Bot>[] = [
        {
          name: 'ProductBot',
          behavior: 'Handles product-related queries',
          type: BotTypeEnum.PRODUCTS,
        },
        {
          name: 'CurrencyBot',
          behavior: 'Handles currency-related queries',
          type: BotTypeEnum.CURRENCIES,
        },
      ];

      await this.botRepository.save(botData);
      this.logger.debug('Bot seeding completed');
    } catch (error) {
      this.logger.error('Error seeding bots', error);
    }
  }
}
