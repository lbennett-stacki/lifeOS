import { Agent, AgentCapability } from '@lifeos/ai';
import { Inject } from '@lifeos/di';
import { Logger } from '@lifeos/logger';
import { LoggerProviderKey } from '../logger.js';

@Agent({
  name: 'time',
  description: "Access the user's date and time information",
})
export class TimeAgent {
  constructor(@Inject(LoggerProviderKey) private readonly logger: Logger) {}

  @AgentCapability("gets the user's current local time")
  async localDatetime() {
    this.logger.debug('localDatetime test');

    return { datetime: new Date().toLocaleString() };
  }
}
