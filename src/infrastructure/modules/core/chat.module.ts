import { Global, Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICreateChatUsecase, ISendMessageUsecase } from '@domain/ports';
import { IChatRepository } from '@domain/repositories';
import { ChatController } from '@infrastructure/controllers';
import { Bot, Chat } from '@infrastructure/entities';
import { ChatRepository } from '@infrastructure/repositories';
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
    FileService,
    OpenAIService,
  ],
  exports: [IChatRepository],
})
export class ChatModule {}
