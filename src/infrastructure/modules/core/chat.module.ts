import { Global, Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICreateChatUsecase, ISendMessageUsecase } from '@domain/ports';
import { IBotRepository, IChatRepository } from '@domain/repositories';
import { ChatController } from '@infrastructure/controllers';
import { Bot, Chat, Message } from '@infrastructure/entities';
import { BotRepository, ChatRepository } from '@infrastructure/repositories';
import { CreateChatUsecase, SendMessageUsecase } from '@usecases/index';
import { FileService, OpenAIService } from '@infrastructure/services';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Chat, Bot])],
  controllers: [ChatController],
  providers: [
    {
      provide: ICreateChatUsecase,
      useClass: CreateChatUsecase,
      scope: Scope.REQUEST,
    },
    {
      provide: ISendMessageUsecase,
      useClass: SendMessageUsecase,
      scope: Scope.REQUEST,
    },
    {
      provide: IChatRepository,
      useClass: ChatRepository,
    },
    {
      provide: IBotRepository,
      useClass: BotRepository,
    },
    FileService,
    OpenAIService,
  ],
  exports: [IChatRepository],
})
export class ChatModule {}
