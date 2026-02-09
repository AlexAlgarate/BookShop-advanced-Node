import { UserCreationQuery } from '@domain/types/user/UserCreationQuery';

export class CreateUserUseCase {
  async execute(query: UserCreationQuery) {
    // User does not exist
    // hash password
    // create user
  }
}
