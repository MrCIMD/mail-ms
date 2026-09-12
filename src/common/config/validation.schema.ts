import * as joi from 'joi';

export const validationSchema = joi.object({
  AMQP_SERVERS: joi.string().required(),
  IAM_ACCESS_KEY: joi.string().required(),
  IAM_SECRET_KEY: joi.string().required(),
  AWS_REGION: joi.string().required(),
  IDENTITY_NAME: joi.string().required(),
  TEMPLATE_DIR: joi.string().default('/usr/app/templates'),
});
