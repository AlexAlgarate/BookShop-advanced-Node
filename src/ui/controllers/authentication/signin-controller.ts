import { getControllers } from '@di/controller-factory';
import { authenticationBodySchema } from '@ui/validators/authentication-validators';
import { Request, Response } from 'express';

export const signinController = async (request: Request, response: Response): Promise<void> => {
  const { email, password } = authenticationBodySchema.parse(request.body);

  const { loginUserUseCase } = getControllers();
  const { token } = await loginUserUseCase().execute({ email, password });

  response.json({ content: token });
};
