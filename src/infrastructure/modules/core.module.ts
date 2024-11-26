import { Module } from '@nestjs/common';
import { BotModule, ChatModule, MessageModule } from '@infrastructure/modules';
@Module({
  imports: [BotModule, ChatModule, MessageModule],
})
export class CoreModule {}
