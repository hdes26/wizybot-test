import { SendMessageDTO, SendMessageResponseDTO } from '@domain/dtos';
import { BotTypeEnum } from '@domain/enum';
import { IProduct } from '@domain/interfaces';
import { ISendMessageUsecase } from '@domain/ports';
import { IBotRepository, IChatRepository } from '@domain/repositories';
import { OpenAIService } from '@infrastructure/services';
import { FileService } from '@infrastructure/services/file.service'; // Asegúrate de importar el servicio
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class SendMessageUsecase implements ISendMessageUsecase {
  private readonly logger = new Logger(SendMessageUsecase.name);

  constructor(
    private readonly repository: IChatRepository,
    private readonly botRepository: IBotRepository,
    private readonly openAIService: OpenAIService,
    private readonly fileService: FileService,
  ) {}

  async handle(payload: SendMessageDTO): Promise<SendMessageResponseDTO> {
    try {
      const exists = await this.repository.findOne({
        where: { userIp: payload.userIp },
      });
      if (!exists) throw new NotFoundException(`Chat not found.`);

      const userQuery = payload.message;

      const { functionCall } = await this.openAIService.getFunction(userQuery);

      if (functionCall.name === 'searchProducts') {
        const products = await this.searchProducts(functionCall);

        const response = await this.generateProductsResponse(products);
        return { answer: response };
      }

      if (functionCall.name === 'convertCurrencies') {
        const response = await this.generateCurrenciesResponse(functionCall);
        return { answer: response };
      }

      if (functionCall.name === 'recommendGift') {
        const response = await this.generateRecommendationResponse();
        return { answer: response };
      }

      if (functionCall.name === 'getWeather') {
        const response = await this.generateWeatherResponse(functionCall);
        return { answer: response };
      }

      if (functionCall.name === 'getPopulation') {
        const response = await this.generatePopulationResponse(functionCall);
        return { answer: response };
      }
    } catch (error) {
      this.logger.error('Error in chat', error);
      throw error;
    }
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
    name: string;
    arguments: string;
  }): Promise<string> {
    return await this.openAIService.generateCurrenciesResponse(functionCall);
  }

  private async generateProductsResponse(
    products: IProduct[],
  ): Promise<string> {
    const { behavior } = await this.botRepository.findOne({
      where: { type: BotTypeEnum.PRODUCTS },
    });
    return await this.openAIService.generateProductsResponse(
      products,
      behavior,
    );
  }

  private async generateRecommendationResponse(): Promise<string> {
    return await this.openAIService.generateRecommendationResponse();
  }

  private async generateWeatherResponse(functionCall: {
    name: string;
    arguments: string;
  }): Promise<string> {
    return await this.openAIService.generateWeatherResponse(functionCall);
  }

  private async generatePopulationResponse(functionCall: {
    name: string;
    arguments: string;
  }): Promise<string> {
    return await this.openAIService.generatePopulationResponse(functionCall);
  }
}
