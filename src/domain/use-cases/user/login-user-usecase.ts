import { LoginUserQuery } from '@domain/types/user/LoginUserQuery';

export class LoginUserUseCase {
  async execute(query: LoginUserQuery) {
    // Check if the user exists
    // Check received password is the saved one
    // generate jwt
  }
}
