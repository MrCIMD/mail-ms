import { Config } from './config.type';

export default (): Config => ({
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});
