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
        host: configService.get<string>('config.database.host'),
        port: configService.get<number>('config.database.port'),
        username: configService.get<string>('config.database.user'),
        password: configService.get<string>('config.database.password'),
        database: configService.get<string>('config.database.name'),
        schema: configService.get<string>('config.database.schema'),
        entities: entitiesLists,
        synchronize: true,
        autoLoadEntities: true,
        then: console.debug(
          `postgres host: ${configService.get<string>('config.database.host')}`,
          `DB =>`,
        ),
      }),
    }),
    CommonModule,
    CoreModule,
  ],
})
export class AppModule {}
