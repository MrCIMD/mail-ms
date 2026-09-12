import { Config } from './config.type';

export default (): Config => ({
  AMQP_SERVERS: process.env.AMQP_SERVERS?.split(','),
  IAM_ACCESS_KEY: process.env.IAM_ACCESS_KEY,
  IAM_SECRET_KEY: process.env.IAM_SECRET_KEY,
  AWS_REGION: process.env.AWS_REGION,
  IDENTITY_NAME: process.env.IDENTITY_NAME,
  TEMPLATE_DIR: process.env.TEMPLATE_DIR,
});
