import 'dotenv/config';
import { expect, test, vi, describe } from 'vitest';
import { AgentApp } from '@lifeos/ai';
import { MailHog } from '@lifeos/mailhog';
import { RootAgentModule } from '../src/agents/module.ts';
import { TimeAgent } from '../src/agents/time.ts';
import { ContactsAgent } from '../src/agents/comms/contacts.ts';
import { EmailAgent } from '../src/agents/comms/email.ts';

const mockDate = new Date(2000, 1, 1, 1, 1, 1, 1);

describe('modules/core/ai integration tests', () => {
  test('DI container resolves agents', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);

    const app = new AgentApp(RootAgentModule);

    const timeAgentResolved = app.resolve(TimeAgent);

    expect(timeAgentResolved).toBeDefined();
    expect(await timeAgentResolved.localDatetime()).toMatchSnapshot();

    vi.useRealTimers();
  });

  test('Demo flow A - Send the current time to a contact via email', async () => {
    /*
     * "Send the current time to Luke via email"
     *
     * intent recognition output
     * -------------------------
     * { path: ['time', 'localdatetime'], args: [] },
     * { path: ['comms', 'contacts', 'search'], args: ['Luke'] },
     * { path: ['comms', 'email', 'sendEmail'], args: [email, subject, text] },
     *
     */

    const hog = await MailHog.start();

    const app = new AgentApp(RootAgentModule);

    const timeAgent = app.resolve(TimeAgent);
    const contactsAgent = app.resolve(ContactsAgent);
    const emailAgent = app.resolve(EmailAgent);

    const { datetime: currentTime } = await timeAgent.localDatetime();
    const luke = await contactsAgent.search('Luke');
    if (!luke) {
      throw new Error('Luke not found');
    }
    await emailAgent.sendEmail(
      luke.email,
      `demo flow A`,
      `Hello ${luke.firstName}. The current time is ${currentTime}`,
    );

    expect(luke).toMatchSnapshot();

    await hog.stop();
  });
});
