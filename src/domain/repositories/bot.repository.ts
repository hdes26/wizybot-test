import { BotModel } from '@domain/models';
import { IBaseRepository } from './base.repository';

export abstract class IBotRepository extends IBaseRepository<BotModel> {}
