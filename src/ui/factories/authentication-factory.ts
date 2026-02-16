import { UserMongoRepository } from '@infrastructure/repositories/user-mongo-repository';

export class AuthenticationFactory {
  static createUserRepository(): UserMongoRepository {
    return new UserMongoRepository();
  }
}
