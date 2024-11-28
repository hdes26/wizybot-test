import { IProduct } from '@domain/interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class OpenAIService {
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        Authorization: `Bearer ${this.configService.get<string>('config.openai.key')}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private searchProducts(query: string, products: IProduct[]): IProduct[] {
    const queryWords = query.toLowerCase().split(' ');

    return products
      .filter((product) => {
        const displayTitleLower = product.displayTitle.toLowerCase();

        let matches = false;

        for (const word of queryWords) {
          if (displayTitleLower.includes(word)) {
            matches = true;
            break;
          }
        }

        return matches;
      })
      .slice(0, 5);
  }

  private async convertCurrencies(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<number> {
    const apiKey = this.configService.get<string>(
      'config.openExchangeRates.key',
    );
    const url = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;
    const response = await axios.get(url);
    const rates = response.data.rates;

    const fromRate = rates[fromCurrency.toUpperCase()];
    const toRate = rates[toCurrency.toUpperCase()];

    if (!fromRate || !toRate) {
      throw new Error('Invalid currency code');
    }

    return (amount / fromRate) * toRate;
  }

  private generateProductResponse(product: IProduct): string {
    return `
    - **Product**: ${product.displayTitle}
    - **Price**: $${product.price}
    - **Description**: ${product.embeddingText}
    - **Category**: ${product.productType}
    - **URL**: ${product.url}
    - **Image**: ${product.imageUrl}
    - **Discount**: ${product.discount}%
    - **Variants**: ${product.variants}
  `;
  }

  async getFunction(
    query: string,
    products: IProduct[],
  ): Promise<{ message: string }> {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: query },
    ];

    const functions = [
      {
        name: 'searchProducts',
        description: 'Search for products related to the query',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'The search term' },
          },
          required: ['query'],
        },
      },
      {
        name: 'convertCurrencies',
        description: 'Convert an amount from one currency to another',
        parameters: {
          type: 'object',
          properties: {
            amount: { type: 'number', description: 'The amount to convert' },
            fromCurrency: {
              type: 'string',
              description: 'The original currency',
            },
            toCurrency: { type: 'string', description: 'The target currency' },
          },
          required: ['amount', 'fromCurrency', 'toCurrency'],
        },
      },
    ];

    try {
      const response = await this.axiosInstance.post('/chat/completions', {
        model: 'gpt-4',
        messages,
        functions,
        function_call: 'auto',
      });

      const { function_call } = response.data.choices[0].message;

      if (function_call?.name === 'searchProducts') {
        const args = JSON.parse(function_call.arguments);
        const searchResults = this.searchProducts(args.query, products);

        if (searchResults.length > 0) {
          const productDescriptions = searchResults.map((product) =>
            this.generateProductResponse(product),
          );

          const openaiPrompt = `
            Based on the following products found for the search query "${args.query}":

            ${productDescriptions.join('\n')}

            Provide a smart, accurate and short response.
          `;
          const openaiResponse = await this.axiosInstance.post(
            '/chat/completions',
            {
              model: 'gpt-4',
              messages: [
                {
                  role: 'system',
                  content: 'You are an intelligent assistant.',
                },
                { role: 'user', content: openaiPrompt },
              ],
            },
          );

          const generatedResponse =
            openaiResponse.data.choices[0].message.content;

          return { message: generatedResponse };
        } else {
          return { message: 'I was unable to process your request.' };
        }
      }

      if (function_call?.name === 'convertCurrencies') {
        const args = JSON.parse(function_call.arguments);
        const convertedAmount = await this.convertCurrencies(
          args.amount,
          args.fromCurrency,
          args.toCurrency,
        );
        return { message: `${convertedAmount}` };
      }

      return { message: 'I was unable to process your request.' };
    } catch (error) {
      console.error(
        'Error calling OpenAI API:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to call OpenAI API');
    }
  }
}
