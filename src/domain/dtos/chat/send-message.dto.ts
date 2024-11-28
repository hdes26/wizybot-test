import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIP } from 'class-validator';

export class SendMessageDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsIP()
  @IsNotEmpty()
  userIp: string;
}
