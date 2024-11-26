import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '@infrastructure/config/config';
import { validationSchema } from '@infrastructure/config/validation-schema';
import { CommonModule } from './common.module';
import { CoreModule } from './core.module';

import * as entities from '@infrastructure/entities';

const entitiesLists = Object.values(entities).flat();

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        schema: configService.get<string>('DB_SCHEMA'),
        entities: entitiesLists,
        synchronize: true,
        autoLoadEntities: true,
        then: console.debug(
          `postgres host:${configService.get<string>('DB_HOST')}`,
          `DB =>`,
        ),
      }),
    }),
    CommonModule,
    CoreModule,
  ],
})
export class AppModule {}
