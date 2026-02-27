import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@domain/types/errors';
import { container } from '@di/container';
import { SecurityService } from '@domain/services/SecurityService';
import { SECURITY_SERVICE } from '@di/tokens';

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
    const securityService = container.resolve<SecurityService>(SECURITY_SERVICE);
    const { userId } = securityService.verifyJWT(token);
    request.user = { id: userId };
    next();
  } catch {
    throw new UnauthorizedError('Invalid token');
  }
};
