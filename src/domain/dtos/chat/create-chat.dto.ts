import { BotTypeEnum } from '@domain/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIP, IsNotEmpty } from 'class-validator';

export class CreateChatDTO {
  @ApiProperty()
  @IsIP()
  @IsNotEmpty()
  userIp: string;

  @ApiProperty()
  @IsEnum(BotTypeEnum)
  @IsNotEmpty()
  botType: BotTypeEnum;
}
