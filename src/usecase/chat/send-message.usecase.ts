import { SendMessageDTO } from '@domain/dtos';
import { ISendMessageUsecase } from '@domain/ports';
import { IChatRepository } from '@domain/repositories';
import { OpenAIService } from '@infrastructure/services';
import { FileService } from '@infrastructure/services/file.service'; // Asegúrate de importar el servicio
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendMessageUsecase implements ISendMessageUsecase {
  constructor(
    private readonly repository: IChatRepository,
    private readonly openAIService: OpenAIService,
    private readonly fileService: FileService,
  ) {}

  async handle(payload: SendMessageDTO): Promise<any> {
    const userQuery = payload.message;

    const csvData = await this.fileService.readProductsFile();
    const products = await this.fileService.parseCSV(csvData);

    const llmResponse = await this.openAIService.getFunction(
      userQuery,
      products,
    );

    return llmResponse;
  }
}
