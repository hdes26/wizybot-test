import { Message } from '@infrastructure/entities';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [],
  providers: [],
  exports: [],
})
export class MessageModule {}
