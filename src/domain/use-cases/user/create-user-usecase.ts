import { UserRepository } from '@domain/repositories/UserRepository';
import { SecurityService } from '@domain/services/SecurityService';
import { BusinessConflictError } from '@domain/types/errors';
import { CreateUserQuery } from '@domain/types/user/CreateUserQuery';

export class CreateUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly securityService: SecurityService;

  constructor(userRepository: UserRepository, securityService: SecurityService) {
    this.userRepository = userRepository;
    this.securityService = securityService;
  }
  async execute(query: CreateUserQuery) {
    // User does not exist
    const user = await this.userRepository.findByEmail(query.email);

    if (user) {
      throw new BusinessConflictError('The user already exists');
    }

    // hash password
    const hashedPassword = await this.securityService.hashPassword(query.password);

    // create user
    const createdUser = await this.userRepository.createOne({
      email: query.email,
      password: hashedPassword,
    });

    return createdUser;
  }
}
