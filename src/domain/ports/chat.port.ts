import {
  CreateChatDTO,
  CreateChatResponseDTO,
  SendMessageDTO,
  SendMessageResponseDTO,
} from '@domain/dtos';

export abstract class ICreateChatUsecase {
  abstract handle(payload: CreateChatDTO): Promise<CreateChatResponseDTO>;
}

export abstract class ISendMessageUsecase {
  abstract handle(payload: SendMessageDTO): Promise<SendMessageResponseDTO>;
}
