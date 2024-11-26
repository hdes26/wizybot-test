import {
  CreateChatDto,
  CreateChatResponseDto,
  SendMessageDto,
  SendMessageResponseDto,
} from '@domain/dtos';

export abstract class ICreateChatUsecase {
  abstract handle(payload: CreateChatDto): Promise<CreateChatResponseDto>;
}

export abstract class ISendMessageUsecase {
  abstract handle(payload: SendMessageDto): Promise<SendMessageResponseDto>;
}
