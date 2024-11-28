import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  nodeEnv: process.env.NODE_ENV,
  httpServer: {
    port: process.env.HTTP_SERVER_PORT,
  },
  swagger: {
    user: process.env.SWAGGER_USER,
    password: process.env.SWAGGER_PASS,
  },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_DATABASE,
  },
  httpBasicAuth: {
    user: process.env.HTTP_BASIC_USER,
    password: process.env.HTTP_BASIC_PASS,
  },
  openai: {
    key: process.env.OPENAI_API_KEY,
  },
}));
