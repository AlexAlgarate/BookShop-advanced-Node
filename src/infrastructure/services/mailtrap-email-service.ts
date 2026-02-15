import { MailtrapClient } from 'mailtrap';

import { EmailService } from '@domain/services/EmailService';
import { environmentService } from './environment-service';

export class MailtrapService implements EmailService {
  private readonly mailtrapClient: MailtrapClient;
  private readonly isSandbox: boolean;
  private readonly senderEmail: string;

  constructor() {
    const { MAILTRAP_TOKEN, INBOXID, IS_SANDBOX } = environmentService.get();
    this.isSandbox = IS_SANDBOX === 'true';
    const inboxId = this.isSandbox ? Number(INBOXID) : undefined;

    this.senderEmail = this.isSandbox ? 'hello@demomailtrap.co' : 'no-reply@tu-dominio.com';

    this.mailtrapClient = new MailtrapClient({
      token: MAILTRAP_TOKEN,
      sandbox: this.isSandbox,
      testInboxId: inboxId,
    });
  }

  async sendEmailToSeller(email: string, message: string, subject: string): Promise<void> {
    try {
      await this.mailtrapClient.send({
        from: {
          name: 'Mailtrap Test',
          email: this.senderEmail,
        },
        to: [{ email }],
        subject: subject,
        text: message,
      });
      console.log(`Email sent to ${email} with subject "${subject}"`);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
    }
  }
}
