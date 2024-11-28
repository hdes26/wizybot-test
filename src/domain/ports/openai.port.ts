export abstract class IGetFunctionsUsecase {
  abstract handle(payload: string): Promise<any>;
}
