import 'reflect-metadata';
import { injectable, inject } from 'inversify';

import { UserRepository } from '@domain/repositories/UserRepository';
import { SecurityService } from '@domain/services/SecurityService';
import { EntityNotFoundError, UnauthorizedError } from '@domain/types/errors';
import { LoginUserQuery } from '@domain/types/user/LoginUserQuery';
import { USER_REPOSITORY, SECURITY_SERVICE } from '@di/tokens';

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @inject(SECURITY_SERVICE) private readonly securityService: SecurityService
  ) {}

  async execute(query: LoginUserQuery): Promise<{
    token: string;
  }> {
    const existingUser = await this.userRepository.findByEmail(query.email);

    if (!existingUser) throw new EntityNotFoundError('User', query.email);

    const arePasswordEqual = await this.securityService.comparePasswords(
      query.password,
      existingUser.password
    );

    if (arePasswordEqual) {
      const token = this.securityService.generateJWT(existingUser);
      return { token };
    } else {
      throw new UnauthorizedError('Wrong password');
    }
  }
}