import { container } from '@di/container';
import { CREATE_USER_USE_CASE } from '@di/tokens';
import { CreateUserUseCase } from '@domain/use-cases/user/create-user-usecase';
import { authenticationBodySchema } from '@ui/validators/authentication-validators';
import { Request, Response } from 'express';

export const signupController = async (request: Request, response: Response): Promise<void> => {
  const { email, password } = authenticationBodySchema.parse(request.body);

  const createUserUseCase = container.get<CreateUserUseCase>(CREATE_USER_USE_CASE);
  await createUserUseCase.execute({ email, password });
  response.status(201).json({ content: 'User created successfully' });
};