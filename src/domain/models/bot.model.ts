import { BotTypeEnum } from '@domain/enum';
import { BaseModel } from './base.model';
import { ChatModel } from './chat.model';

export class BotModel extends BaseModel {
  id: string;
  name: string;
  behavior: string;
  type: BotTypeEnum;
  chats: ChatModel[];
}
