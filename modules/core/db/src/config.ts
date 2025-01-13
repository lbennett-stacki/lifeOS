import { configSchema } from '@lifeos/db';
import { parseConfig } from '@lifeos/config';
import { logger } from './logger.js';

export const config = parseConfig(
  { namespace: '@lifeos/core-db', schema: configSchema, logger },
  {
    url: process.env.CORE_DATABASE_URL,
  },
);
