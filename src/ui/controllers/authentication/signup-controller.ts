import { getControllers } from '@di/controller-factory';
import { authenticationBodySchema } from '@ui/validators/authentication-validators';
import { Request, Response } from 'express';

export const signupController = async (request: Request, response: Response): Promise<void> => {
  const { email, password } = authenticationBodySchema.parse(request.body);

  const { createUserUseCase } = getControllers();
  await createUserUseCase().execute({ email, password });
  response.status(201).json({ content: 'User created successfully' });
};
