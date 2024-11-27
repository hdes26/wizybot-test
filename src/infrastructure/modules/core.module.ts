import { Module } from '@nestjs/common';
import { BotModule, ChatModule, MessageModule } from '@infrastructure/modules';
import { BasicStrategy } from '@infrastructure/strategies/basic';
@Module({
  imports: [BotModule, ChatModule, MessageModule],
  providers: [BasicStrategy],
})
export class CoreModule {}
