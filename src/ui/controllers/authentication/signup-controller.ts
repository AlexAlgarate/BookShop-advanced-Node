import { CreateUserUseCase } from '@domain/use-cases/user/create-user-usecase';
import { AuthenticationFactory } from '@ui/factories/authentication-factory';
import { ServiceFactories } from '@ui/factories/service-factories';
import { authenticationBodySchema } from '@ui/validators/authentication-validators';
import { Request, Response } from 'express';

export const signupController = async (request: Request, response: Response): Promise<void> => {
  const { email, password } = authenticationBodySchema.parse(request.body);

  const userRepository = AuthenticationFactory.createUserRepository();
  const securityService = ServiceFactories.createSecurityService();

  const createUserUseCase = new CreateUserUseCase(userRepository, securityService);

  await createUserUseCase.execute({ email, password });
  response.status(201).json({ content: 'User created successfully' });
};
