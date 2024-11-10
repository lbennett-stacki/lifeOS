import { z } from 'zod';
import { nodeEnvSchema, parseConfig } from '@lifeos/config';
import { logger } from './logger.js';

const openaiConfigSchema = z.object({
  url: z.string().url(),
  key: z.string(),
});

const llamaConfigSchema = z.object({
  url: z.string().url(),
});

const configSchema = z.object({
  llm: openaiConfigSchema.or(llamaConfigSchema),
  nodeEnv: nodeEnvSchema,
});

export const config = parseConfig(
  { namespace: '@lifeos/ai', schema: configSchema, logger },
  {
    llm: process.env.LLAMA_URL
      ? { url: process.env.LLAMA_URL }
      : {
          url: process.env.OPENAI_URL,
          key: process.env.OPENAI_KEY,
        },
    nodeEnv: process.env.NODE_ENV,
  },
);
