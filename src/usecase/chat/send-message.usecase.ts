import { SendMessageDTO, SendMessageResponseDTO } from '@domain/dtos';
import { BotTypeEnum } from '@domain/enum';
import { IProduct } from '@domain/interfaces';
import { ChatModel } from '@domain/models';
import { ISendMessageUsecase } from '@domain/ports';
import {
  IBotRepository,
  IChatRepository,
  IMessageRepository,
} from '@domain/repositories';
import { OpenAIService } from '@infrastructure/services';
import { FileService } from '@infrastructure/services/file.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class SendMessageUsecase implements ISendMessageUsecase {
  private readonly logger = new Logger(SendMessageUsecase.name);

  constructor(
    private readonly repository: IChatRepository,
    private readonly botRepository: IBotRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly openAIService: OpenAIService,
    private readonly fileService: FileService,
  ) {}

  async handle(payload: SendMessageDTO): Promise<SendMessageResponseDTO> {
    try {
      const chat = await this.getChatByUserIp(payload.userIp);

      await this.createMessage(payload.message, chat, 'client');

      const { functionCall } = await this.openAIService.getFunction(
        payload.message,
      );

      const response = await this.handleFunctionCall(functionCall);

      await this.createMessage(response, chat, 'bot');

      return { answer: response };
    } catch (error) {
      this.logger.error('Error in chat handling', error);
      throw error;
    }
  }

  private async getChatByUserIp(userIp: string): Promise<ChatModel> {
    const chat = await this.repository.findOne({ where: { userIp } });

    if (!chat) {
      throw new NotFoundException(`Chat not found for user IP: ${userIp}`);
    }

    return chat;
  }

  private async createMessage(
    message: string,
    chat: ChatModel,
    sender: 'client' | 'bot',
  ): Promise<void> {
    const newMessage = await this.messageRepository.create();
    Object.assign(newMessage, {
      message,
      sender,
      chat,
    });
    await this.messageRepository.save(newMessage);
  }

  private async handleFunctionCall(functionCall: {
    name: string;
    arguments: string;
  }): Promise<string> {
    switch (functionCall.name) {
      case 'searchProducts':
        return this.handleSearchProducts(functionCall);
      case 'convertCurrencies':
        return this.handleConvertCurrencies(functionCall);
      case 'recommendGift':
        return this.handleRecommendGift();
      case 'getWeather':
        return this.handleGetWeather(functionCall);
      case 'getPopulation':
        return this.handleGetPopulation(functionCall);
      default:
        throw new NotFoundException(
          `Function ${functionCall.name} not supported.`,
        );
    }
  }

  private async handleSearchProducts(functionCall: {
    name: string;
    arguments: string;
  }): Promise<string> {
    const products = await this.searchProducts(functionCall);
    return this.generateProductsResponse(products);
  }

  private async handleConvertCurrencies(functionCall: {
    arguments: string;
  }): Promise<string> {
    return this.generateCurrenciesResponse(functionCall);
  }

  private async handleRecommendGift(): Promise<string> {
    return this.generateRecommendationResponse();
  }

  private async handleGetWeather(functionCall: {
    arguments: string;
  }): Promise<string> {
    return this.generateWeatherResponse(functionCall);
  }

  private async handleGetPopulation(functionCall: {
    arguments: string;
  }): Promise<string> {
    return this.generatePopulationResponse(functionCall);
  }

  private async searchProducts(functionCall: {
    name: string;
    arguments: string;
  }): Promise<IProduct[]> {
    const csvData = await this.fileService.readProductsFile();
    const products = await this.fileService.parseCSV(csvData);
    return this.openAIService.searchProducts(functionCall, products);
  }

  private async generateCurrenciesResponse(functionCall: {
    arguments: string;
  }): Promise<string> {
    return this.openAIService.generateCurrenciesResponse(functionCall);
  }

  private async generateProductsResponse(
    products: IProduct[],
  ): Promise<string> {
    const { behavior } = await this.botRepository.findOne({
      where: { type: BotTypeEnum.PRODUCTS },
    });
    return this.openAIService.generateProductsResponse(products, behavior);
  }

  private async generateRecommendationResponse(): Promise<string> {
    return this.openAIService.generateRecommendationResponse();
  }

  private async generateWeatherResponse(functionCall: {
    arguments: string;
  }): Promise<string> {
    return this.openAIService.generateWeatherResponse(functionCall);
  }

  private async generatePopulationResponse(functionCall: {
    arguments: string;
  }): Promise<string> {
    return this.openAIService.generatePopulationResponse(functionCall);
  }
}
