import { IProduct } from '@domain/interfaces';
import { promises as fs } from 'fs';
import * as path from 'path';

export class FileService {
  private readonly productsPath: string;

  constructor() {
    this.productsPath = path.resolve(__dirname, '../../../products_list.csv');
  }

  async readProductsFile(): Promise<string> {
    try {
      return await fs.readFile(this.productsPath, 'utf-8');
    } catch (error) {
      console.error('Error reading CSV file:', error.message);
      throw new Error('Failed to read products file.');
    }
  }

  async parseCSV(data: string): Promise<IProduct[]> {
    const rows = data.split('\n').slice(1);
    const productRegex = /(".*?"|[^",\n]+)(?=\s*,|\s*$)/g;

    return rows
      .map((row) => {
        const matches = [...row.matchAll(productRegex)];

        if (matches.length < 3) {
          return null;
        }

        const [
          displayTitle,
          embeddingText,
          url,
          imageUrl,
          productType,
          discount,
          price,
          variants,
          createDate,
        ] = matches.map((match) => match[0].replace(/"/g, '').trim());

        return {
          displayTitle,
          embeddingText,
          url,
          imageUrl,
          productType,
          discount,
          price,
          variants,
          createDate,
        };
      })
      .filter((product): product is IProduct => product !== null);
  }

  async loadProducts(): Promise<IProduct[]> {
    try {
      const csvData = await this.readProductsFile();
      const products = await this.parseCSV(csvData);
      return products;
    } catch (error) {
      console.error('Error loading products:', error.message);
      throw new Error('Failed to load products.');
    }
  }
}
