import { AgentModule } from '@lifeos/ai';
import { ContactsAgent } from './contacts.js';
import { EmailAgent } from './email.js';

@AgentModule({
  name: 'comms',
  agents: [ContactsAgent, EmailAgent],
})
export class CommsAgentModule {}
