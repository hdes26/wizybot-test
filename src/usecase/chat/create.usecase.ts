import { CreateChatDTO, CreateChatResponseDTO } from '@domain/dtos';
import { ICreateChatUsecase } from '@domain/ports';
import { IBotRepository, IChatRepository } from '@domain/repositories';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class CreateChatUsecase implements ICreateChatUsecase {
  constructor(
    private readonly repository: IChatRepository,
    private readonly botRepository: IBotRepository,
  ) {}

  async handle(payload: CreateChatDTO): Promise<CreateChatResponseDTO> {
    const { userIp, botType } = payload;

    const exists = await this.repository.findOne({ where: { userIp } });
    if (exists) throw new ConflictException(`Chat already exists.`);

    const botFound = await this.botRepository.findOne({
      where: { type: botType },
    });

    const chat = await this.repository.create();
    Object.assign(chat, { userIp, bot: botFound });

    await this.repository.save(chat);

    return { message: 'chat created' };
  }
}
