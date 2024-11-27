import { MessageModel } from '@domain/models';
import { IBaseRepository } from './base.repository';

export abstract class IMessageRepository extends IBaseRepository<MessageModel> {}
