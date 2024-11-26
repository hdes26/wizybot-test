import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
