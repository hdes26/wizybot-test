import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  HTTP_SERVER_PORT: Joi.string().required(),
  SWAGGER_USER: Joi.string().required(),
  SWAGGER_PASS: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  HTTP_BASIC_USER: Joi.string().required(),
  HTTP_BASIC_PASS: Joi.string().required(),
});
