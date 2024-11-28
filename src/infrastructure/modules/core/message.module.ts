import { IMessageRepository } from '@domain/repositories';
import { Message } from '@infrastructure/entities';
import { MessageRepository } from '@infrastructure/repositories';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [],
  providers: [
    {
      provide: IMessageRepository,
      useClass: MessageRepository,
    },
  ],
  exports: [IMessageRepository],
})
export class MessageModule {}
