import { z } from 'zod';
import { parseConfig } from '@lifeos/config';
import { logger } from './logger.js';

const smtpSchema = z.object({
  host: z.string(),
  port: z.string(),
  username: z.string(),
  password: z.string(),
});

const configSchema = z.object({
  smtp: smtpSchema,
});

export const config = parseConfig(
  { namespace: '@lifeos/core-ai', schema: configSchema, logger },
  {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      username: process.env.SMTP_USERNAME,
      password: process.env.SMTP_PASSWORD,
    },
  },
);
