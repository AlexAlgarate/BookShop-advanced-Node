import { UserCreationQuery } from '@domain/types/user/UserCreationQuery';

export class LoginUserUseCase {
  async execute(query: UserCreationQuery) {
    // Check if the user exists
    // Check received password is the saved one
    // generate jwt
  }
}
