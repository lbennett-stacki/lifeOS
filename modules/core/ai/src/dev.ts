import 'dotenv/config';
import { logger } from './logger';
import { RootAgentModule } from './agents/module';
import { AgentApp } from '@lifeos/ai';
import { MailHog } from '@lifeos/mailhog';
import { TimeAgent } from './agents/time';
import { ContactsAgent, EmailAgent } from './lib';

const log = logger.function('dev.main');

const smokeTestDI = <A extends AgentApp<any, any>>(app: A) => {
  const timeAgentResolved = app.resolve(TimeAgent);
  log.debug('resolve time agent', timeAgentResolved);
  log.debug('time agent fn call test', timeAgentResolved.localDatetime());
};

const smokeTestGraph = <A extends AgentApp<any, any>>(app: A) => {
  const graph = app.graph();
  log.debug('graph', graph);
};

const demoFlowA = async <A extends AgentApp<any, any>>(app: A) => {
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

  console.log({ currentTime, luke });
};

const main = async () => {
  await MailHog.start();

  const app = new AgentApp(RootAgentModule);

  smokeTestDI(app);
  smokeTestGraph(app);
  await demoFlowA(app);
};

main();
