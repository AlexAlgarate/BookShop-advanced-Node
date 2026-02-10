import { UserMongoRepository } from '@infrastructure/repositories/user-mongo-repository';
import { SecurityBcryptService } from '@infrastructure/services/security-bcrypt-service';

interface AuthenticationDependencies {
  userRepository: UserMongoRepository;
  securityService: SecurityBcryptService;
}

export class AuthenticationFactory {
  static createDependencies(): AuthenticationDependencies {
    const userRepository = new UserMongoRepository();
    const securityService = new SecurityBcryptService();

    return { userRepository, securityService };
  }
}
