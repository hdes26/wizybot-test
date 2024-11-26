import { SendMessageDTO, SendMessageResponseDTO } from '@domain/dtos';
import { ISendMessageUsecase } from '@domain/ports';
import { IChatRepository } from '@domain/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendMessageUsecase implements ISendMessageUsecase {
  constructor(private readonly repository: IChatRepository) {}

  async handle(payload: SendMessageDTO): Promise<SendMessageResponseDTO> {
    const message = await this.repository.create();
    Object.assign(message, payload);
    console.log(message);
    return { answer: 'Message sended' };
  }
}
