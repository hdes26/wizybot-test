import { BaseModel } from './base.model';
import { BotModel } from './bot.model';
import { MessageModel } from './message.model';

export class ChatModel extends BaseModel {
  id: string;
  bot: BotModel;
  userIp: string;
  messages: MessageModel[];
}
