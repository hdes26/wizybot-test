import { Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bot } from '@infrastructure/entities';
import { IBotRepository } from '@domain/repositories';
import { IBotSeederUsecase } from '@domain/ports';
import { BotRepository } from '@infrastructure/repositories';
import { BotSeederUsecase } from '@usecases/index';
import { RunSeederService } from '@infrastructure/services/run-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bot])],
  providers: [
    {
      provide: IBotSeederUsecase,
      useClass: BotSeederUsecase,
      scope: Scope.TRANSIENT,
    },
    {
      provide: IBotRepository,
      useClass: BotRepository,
    },
    RunSeederService,
  ],
  exports: [IBotRepository, RunSeederService],
})
export class BotModule {}
