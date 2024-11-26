import { CreateChatDTO, CreateChatResponseDTO } from '@domain/dtos';
import { ICreateChatUsecase } from '@domain/ports';
import { IChatRepository } from '@domain/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateChatUsecase implements ICreateChatUsecase {
  constructor(private readonly repository: IChatRepository) {}

  async handle(payload: CreateChatDTO): Promise<CreateChatResponseDTO> {
    const exists = await this.repository.findOne({
      where: { userIp: payload.userIp },
    });
    console.log(exists);

    return { message: 'Create chat' };
  }
}
