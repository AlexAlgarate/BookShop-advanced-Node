import { Request, Response, NextFunction } from 'express';
import { AuthenticationFactory } from '@ui/factories/authentication-factory';
import { UnauthorizedError } from '@domain/types/errors';

export const authenticationMiddleware = (
  request: Request,
  _response: Response,
  next: NextFunction
): void => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    throw new UnauthorizedError('Authorization header is required');
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new UnauthorizedError('Invalid authorization header format');
  }

  try {
    const { securityService } = AuthenticationFactory.createDependencies();
    const { userId } = securityService.verifyJWT(token);
    request.user = { id: userId };
    next();
  } catch {
    throw new UnauthorizedError('Invalid token');
  }
};
