import { config } from '../../config';
import { Agent, AgentCapability, AgentParam } from '@lifeos/ai';
import nodemailer from 'nodemailer';
import { z } from 'zod';

@Agent({
  name: 'email',
  description: 'Sends emails',
})
export class EmailAgent {
  constructor(
    private readonly transport = nodemailer.createTransport({
      url: `smtp://${config.smtp.host}:${config.smtp.port}`,
    }),
  ) {}

  @AgentCapability('send an email')
  async sendEmail(
    @AgentParam('the recipients email address', z.string().email())
    to: string,
    @AgentParam('email subject', z.string())
    subject: string,
    @AgentParam('plain text body of the email', z.string())
    text: string,
  ) {
    return this.transport.sendMail({
      from: 'lifeos+core-ai@localhost',
      to,
      subject,
      text,
      html: text,
    });
  }
}
