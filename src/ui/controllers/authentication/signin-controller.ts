import { LoginUserUseCase } from '@domain/use-cases/user/login-user-usecase';
import { AuthenticationFactory } from '@ui/factories/authentication-factory';
import { authenticationBodySchema } from '@ui/validators/authentication-validators';
import { Request, Response } from 'express';

export const signinController = async (request: Request, response: Response): Promise<void> => {
  const { email, password } = authenticationBodySchema.parse(request.body);

  const { userRepository, securityService } = AuthenticationFactory.createDependencies();

  const loginUserUseCase = new LoginUserUseCase(userRepository, securityService);

  const { token } = await loginUserUseCase.execute({ email, password });

  response.json({ content: token });
};
