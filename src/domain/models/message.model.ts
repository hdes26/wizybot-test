import { BaseModel } from './base.model';
import { ChatModel } from './chat.model';

export class MessageModel extends BaseModel {
  id: string;
  chat: ChatModel;
  message: string;
}
