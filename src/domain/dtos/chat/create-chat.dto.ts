import { BotType } from '@domain/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIP, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @ApiProperty()
  @IsIP()
  @IsNotEmpty()
  userIp: string;

  @ApiProperty()
  @IsEnum(BotType)
  @IsNotEmpty()
  botType: BotType;
}
