import { Bot } from '@infrastructure/entities';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Bot])],
  controllers: [],
  providers: [],
  exports: [],
})
export class BotModule {}
