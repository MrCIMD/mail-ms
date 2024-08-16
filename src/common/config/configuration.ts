import { Config } from './config.type';

export default (): Config => ({
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
  IAM_ACCESS_KEY: process.env.IAM_ACCESS_KEY,
  IAM_SECRET_KEY: process.env.IAM_SECRET_KEY,
  AWS_REGION: process.env.AWS_REGION,
  IDENTITY_NAME: process.env.IDENTITY_NAME,
});
