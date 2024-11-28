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

  searchProducts(
    functionCall: { name: string; arguments: string },
    products: IProduct[],
  ): IProduct[] {
    const args = JSON.parse(functionCall.arguments);

    const queryWords = args.query.toLowerCase().split(' ');

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
      .slice(0, 3);
  }

  private generateProductsPrompt(products: IProduct[]): string {
    return `
    Here are some products with details:
    ${products
      .map((product) => {
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
      })
      .join('\n')}
    `;
  }

  async generateProductsResponse(
    products: IProduct[],
    behavior: string,
  ): Promise<string> {
    const prompt = this.generateProductsPrompt(products);

    const messages = [
      {
        role: 'system',
        content: behavior,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    try {
      const response = await this.axiosInstance.post('/chat/completions', {
        model: 'gpt-4',
        messages,
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error in creating chat completion:', error);
    }
  }

  async generateCurrenciesResponse(functionCall): Promise<string> {
    const args = JSON.parse(functionCall.arguments);
    const { amount, fromCurrency, toCurrency } = args;
    const apiKey = this.configService.get<string>('config.currencies.key');
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`,
    );
    if (response.data.result !== 'success') {
      throw new Error('Currency conversion failed');
    }
    const convertedAmount = response.data.conversion_result;
    return `${amount} ${fromCurrency} is approximately ${convertedAmount} ${toCurrency}`;
  }

  async generateRecommendationResponse(): Promise<string> {
    return `if you're looking for a gift for someone who loves tech items or if you're looking to upgrade your own devices. Here are my recommendations based on your listed products:\n\n1. **iPhone 12**: A good choice if you're looking for a phone that's not the latest model, but still has competent features at a slightly lower cost. It has the ability to choose from several colors and storage capacities, fitting a wide range of preferences. Available for $900. Link [here](https://wizybot-demo-store.myshopify.com/products/iphone-12)\n\n2. **iPhone 13**: For the gadget savvy user who wants the latest iPhone. A bit pricier, but it's packed with the newest features. Available in two colors (Black, Blue) and two capacities (256gb, 128gb). Pricing starts from $1099. Link [here](https://wizybot-demo-store.myshopify.com/products/iphone-13)\n\n3. **Beats Studio3 Wireless Noise Cancelling Headphones with Apple W1 Headphone Chip**: For the audiophile who appreciates high quality sound and the convenience of wireless listening, these Beats headphones would make a great gift. Available in three colors for $169. Link [here](https://wizybot-demo-store.myshopify.com/products/beats-studio3-wireless-noise-cancelling-headphones-with-apple-w1-headphone-chip)\n\n4. **Wireless Earbuds Bluetooth5.2 Headphones**: These are an affordable alternative to many high-end wireless earbuds on the market, suitable for casual listeners or for physical activities. Available for $50. Link [here](https://wizybot-demo-store.myshopify.com/products/wireless-earbuds-bluetooth5-2-headphones)\n\n5. **iPhone SE**: The iPhone SE is a budget-friendly option that still offers quality performance and features of iOS. With two color and storage options, it's a versatile choice for various user needs. Available for $180. Link [here](https://wizybot-demo-store.myshopify.com/products/iphone-se)\n   \nAll the products have a small discount of 1% at the moment! Enjoy your shopping!`;
  }

  async generateWeatherResponse(functionCall): Promise<string> {
    const args = JSON.parse(functionCall.arguments);

    const city = args.query;

    return await this.getWeather(city);
  }

  async generatePopulationResponse(functionCall): Promise<string> {
    const args = JSON.parse(functionCall.arguments);

    const city = args.query;

    return await this.getPopulation(city);
  }

  async getWeather(city: string): Promise<string> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            appid: this.configService.get<string>('config.weather.key'),
            units: 'metric',
          },
        },
      );

      if (response.status !== 200) {
        throw new Error(`Failed to fetch weather data for ${city}`);
      }

      const { weather, main } = response.data;

      const finalResponse = `The weather today in ${city} is ${weather[0].description}. The temperature is ${main.temp} degrees Celsius.`;

      return finalResponse;
    } catch (error) {
      console.log(error);
      throw new Error(`Unable to retrieve weather information for ${city}.`);
    }
  }

  async getPopulation(country: string): Promise<string> {
    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${country}`,
      );

      if (response.status !== 200) {
        throw new Error(`Failed to fetch population data for ${country}`);
      }

      const countryData = response.data[0];
      const population = countryData.population;
      return `The population of ${country} is ${population}.`;
    } catch (error) {
      throw new Error(
        `Unable to retrieve population information for ${country}.`,
      );
    }
  }

  async getFunction(
    query: string,
  ): Promise<{ functionCall: { name: string; arguments: string } }> {
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
          properties: { query: { type: 'string' } },
          required: ['query'],
        },
      },
      {
        name: 'convertCurrencies',
        description: 'Convert currency amounts',
        parameters: {
          type: 'object',
          properties: {
            amount: { type: 'number' },
            fromCurrency: { type: 'string' },
            toCurrency: { type: 'string' },
          },
          required: ['amount', 'fromCurrency', 'toCurrency'],
        },
      },
      {
        name: 'searchProducts',
        description: 'Search for products related to the query',
        parameters: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query'],
        },
      },
      {
        name: 'recommendGift',
        description:
          "Recommend a gift or present based on the user's preferences or query",
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string' },
          },
          required: ['query'],
        },
      },
      {
        name: 'getWeather',
        description: 'Get weather information based on the query',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string' },
          },
          required: ['query'],
        },
      },
      {
        name: 'getPopulation',
        description: 'Get population information based on the query',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string' },
          },
          required: ['query'],
        },
      },
    ];

    const response = await this.axiosInstance.post('/chat/completions', {
      model: 'gpt-4',
      messages,
      functions,
      function_call: 'auto',
    });

    const { function_call } = response.data.choices[0].message;

    return { functionCall: function_call };
  }
}
