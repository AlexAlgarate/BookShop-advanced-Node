import { MailtrapService } from '@infrastructure/services/mailtrap-email-service';
import { SecurityBcryptService } from '@infrastructure/services/security-bcrypt-service';

export class ServiceFactories {
  static createEmailService(): MailtrapService {
    return new MailtrapService();
  }

  static createSecurityService(): SecurityBcryptService {
    return new SecurityBcryptService();
  }
}
