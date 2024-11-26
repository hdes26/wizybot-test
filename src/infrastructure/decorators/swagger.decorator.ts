import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function SwaggerDocs(
  operation: string,
  summary: string,
  responseType: any,
  example?: any,
) {
  const decorators = [
    ApiOperation({ summary }),
    ApiResponse({
      status: 201,
      description: `${operation} successful`,
      type: responseType,
      ...(example ? { content: { 'application/json': { example } } } : {}),
    }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  ];

  return applyDecorators(...decorators);
}
