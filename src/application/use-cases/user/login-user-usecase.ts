import { UserRepository } from '@domain/repositories/UserRepository';
import { SecurityService } from '@domain/services/SecurityService';
import { EntityNotFoundError, UnauthorizedError } from '@domain/types/errors';
import { LoginUserQuery } from '@domain/types/user/LoginUserQuery';

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly securityService: SecurityService
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