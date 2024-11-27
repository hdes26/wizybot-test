import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatResponseDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
