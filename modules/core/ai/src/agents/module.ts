import { AgentModule } from '@lifeos/ai';
import { TimeAgent } from './time.js';
import { CommsAgentModule } from './comms/module.js';
import { LoggerProvider } from '../logger.js';

@AgentModule({
  name: 'root',
  providers: [LoggerProvider],
  agents: [TimeAgent],
  modules: [CommsAgentModule],
})
export class RootAgentModule {}
