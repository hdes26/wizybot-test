import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  answer: string;
}
