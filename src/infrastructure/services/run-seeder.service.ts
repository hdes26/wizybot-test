import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IBotSeederUsecase } from '@domain/ports';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RunSeederService implements OnApplicationBootstrap {
  constructor(
    private readonly botSeederUsecase: IBotSeederUsecase,
    private readonly configService: ConfigService,
  ) {}

  async run() {
    if (this.configService.get<string>('config.nodeEnv') === 'development') {
      console.log('Executing seeder...');
      await this.botSeederUsecase.handle();
    }
  }

  async onApplicationBootstrap() {
    await this.run();
    console.log('Seeder executed successfully.');
  }
}
