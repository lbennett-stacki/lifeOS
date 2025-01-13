import { OpenAI } from 'openai';
import { Logger } from '@lifeos/logger';
import { config } from '../config.js';
import { LlmAdapter } from './adapter.js';

export const openaiClientFactory = () => {
  return new OpenAI({
    baseURL: config.llm.url,
    apiKey: 'key' in config.llm ? config.llm.key : undefined,
  });
};

export class OpenAIAdapter implements LlmAdapter {
  constructor(private readonly logger: Logger) {
    this.logger = this.logger.service('OpenAIAdapter');
  }

  async prompt(input: string) {
    return 'ECHO OPENAI - ' + input;
  }
}
