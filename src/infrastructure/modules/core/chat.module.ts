import { Chat } from '@infrastructure/entities';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  controllers: [],
  providers: [],
  exports: [],
})
export class ChatModule {}
