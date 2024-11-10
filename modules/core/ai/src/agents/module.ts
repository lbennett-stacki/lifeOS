import { AgentModule } from '@lifeos/ai';
import { TimeAgent } from './time';
import { CommsAgentModule } from './comms/module';
import { LoggerProvider } from '../logger';

@AgentModule({
  providers: [LoggerProvider],
  agents: [TimeAgent],
  modules: [CommsAgentModule],
})
export class RootAgentModule {}
