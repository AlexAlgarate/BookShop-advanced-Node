import { UserMongoRepository } from '@infrastructure/repositories/user-mongo-repository';
import { MailtrapService } from '@infrastructure/services/mailtrap-email-service';
import { SecurityBcryptService } from '@infrastructure/services/security-bcrypt-service';

export class AuthenticationFactory {
  static createUserRepository(): UserMongoRepository {
    return new UserMongoRepository();
  }

  static createEmailService(): MailtrapService {
    return new MailtrapService();
  }

  static createSecurityService(): SecurityBcryptService {
    return new SecurityBcryptService();
  }
}
