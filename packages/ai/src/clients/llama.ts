import LlamaStackClient from 'llama-stack-client';
import { Logger } from '@lifeos/logger';
import { config } from '../config.js';
import { LlmAdapter } from './adapter.js';

export const llamaClientFactory = () =>
  new LlamaStackClient({
    environment: config.nodeEnv === 'production' ? 'production' : 'sandbox',
    baseURL: config.llm.url,
  });

export class LlamaStackAdapter implements LlmAdapter {
  constructor(private readonly logger: Logger) {
    this.logger = this.logger.service('LlamaAdapter');
  }

  async prompt(input: string) {
    return 'ECHO LLAMA - ' + input;
  }
}
