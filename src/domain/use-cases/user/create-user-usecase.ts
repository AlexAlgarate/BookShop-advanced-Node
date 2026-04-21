import { injectable, inject } from 'inversify';

import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import { SecurityService } from '@domain/services/SecurityService';
import { BusinessConflictError } from '@domain/types/errors';
import { CreateUserQuery } from '@domain/types/user/CreateUserQuery';
import { USER_REPOSITORY, SECURITY_SERVICE } from '@di/tokens';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @inject(SECURITY_SERVICE) private readonly securityService: SecurityService
  ) {}

  async execute(query: CreateUserQuery): Promise<User> {
    const user = await this.userRepository.findByEmail(query.email);

    if (user) {
      throw new BusinessConflictError('The user already exists');
    }

    const hashedPassword = await this.securityService.hashPassword(query.password);

    const createdUser = await this.userRepository.createOne({
      email: query.email,
      password: hashedPassword,
    });

    return createdUser;
  }
}
