import { UserMongoRepository } from '@infrastructure/repositories/user-mongo-repository';
import { MailtrapService } from '@infrastructure/services/mailtrap-email-service';
import { SecurityBcryptService } from '@infrastructure/services/security-bcrypt-service';

interface AuthenticationDependencies {
  userRepository: UserMongoRepository;
  securityService: SecurityBcryptService;
  emailService: MailtrapService;
}

export class AuthenticationFactory {
  static createDependencies(): AuthenticationDependencies {
    const userRepository = new UserMongoRepository();
    const securityService = new SecurityBcryptService();
    const emailService = new MailtrapService();

    return { userRepository, securityService, emailService };
  }
}
