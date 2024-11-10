import { AgentModule } from '@lifeos/ai';
import { ContactsAgent } from './contacts';
import { EmailAgent } from './email';

@AgentModule({
  agents: [ContactsAgent, EmailAgent],
})
export class CommsAgentModule {}
