import * as joi from 'joi';

export const validationSchema = joi.object({
  NATS_SERVERS: joi.string().required(),
});
