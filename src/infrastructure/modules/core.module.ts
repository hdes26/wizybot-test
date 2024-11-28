import { Module } from '@nestjs/common';
import { BotModule, ChatModule, MessageModule } from '@infrastructure/modules';
import { BasicStrategy } from '@infrastructure/strategies/basic';
@Module({
  imports: [ChatModule, MessageModule, BotModule],
  providers: [BasicStrategy],
})
export class CoreModule {}
