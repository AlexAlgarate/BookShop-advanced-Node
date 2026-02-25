import { useCases } from '@di/use-case-resolver';
import { authenticationBodySchema } from '@ui/validators/authentication-validators';
import { Request, Response } from 'express';

export const signinController = async (request: Request, response: Response): Promise<void> => {
  const { email, password } = authenticationBodySchema.parse(request.body);

  const { token } = await useCases.loginUser().execute({ email, password });

  response.json({ content: token });
};
