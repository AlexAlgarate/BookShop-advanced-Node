import { container } from '@di/container';
import { LOGIN_USER_USE_CASE } from '@di/tokens';
import { LoginUserUseCase } from '@domain/use-cases/user/login-user-usecase';
import { authenticationBodySchema } from '@ui/validators/authentication-validators';
import { Request, Response } from 'express';

export const signinController = async (request: Request, response: Response): Promise<void> => {
  const { email, password } = authenticationBodySchema.parse(request.body);

  const loginUserUseCase = container.get<LoginUserUseCase>(LOGIN_USER_USE_CASE);
  const { token } = await loginUserUseCase.execute({ email, password });

  response.json({ content: token });
};