import {
  CreateChatDTO,
  CreateChatResponseDTO,
  SendMessageDTO,
  SendMessageResponseDTO,
} from '@domain/dtos';
import { ICreateChatUsecase, ISendMessageUsecase } from '@domain/ports';
import { SwaggerDocs } from '@infrastructure/decorators';
import { BasicGuard } from '@infrastructure/guards/basic';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('CHAT')
@Controller('chat')
@ApiBasicAuth()
@UseGuards(BasicGuard)
export class ChatController {
  constructor(
    private readonly createChatUseCase: ICreateChatUsecase,
    private readonly sendMessageUseCase: ISendMessageUsecase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SwaggerDocs('Create Chat', 'Create a new chat', CreateChatResponseDTO, {
    message: 'Chat created successfully',
  })
  async create(@Body() body: CreateChatDTO): Promise<CreateChatResponseDTO> {
    return await this.createChatUseCase.handle(body);
  }

  @Post('send-message')
  @HttpCode(HttpStatus.CREATED)
  @SwaggerDocs(
    'Send Message',
    'Send a message to a chat',
    SendMessageResponseDTO,
    { message: 'Message sent successfully' },
  )
  async sendMessage(
    @Body() body: SendMessageDTO,
  ): Promise<SendMessageResponseDTO> {
    return await this.sendMessageUseCase.handle(body);
  }
}
