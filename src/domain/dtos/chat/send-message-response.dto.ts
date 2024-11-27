import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageResponseDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  answer: string;
}
