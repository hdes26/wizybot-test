import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '@infrastructure/config/config';
import { validationSchema } from '@infrastructure/config/validation-schema';
import { CommonModule } from './common.module';
import { CoreModule } from './core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      validationSchema,
    }),
    CommonModule,
    CoreModule,
  ],
})
export class AppModule {}
