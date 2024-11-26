import { ChatModel } from '@domain/models';
import { IBaseRepository } from './base.repository';

export abstract class IChatRepository extends IBaseRepository<ChatModel> {}
