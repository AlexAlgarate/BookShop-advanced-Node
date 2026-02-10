import { NextFunction, Response, Request } from 'express';
import { status } from 'http-status';
import * as z from 'zod';
import * as Sentry from '@sentry/node';

import { DomainError } from '@domain/types/errors/DomainError';

const domainErrorToHttpStatusCode: Record<string, number> = {
  EntityNotFoundError: status.NOT_FOUND,
  UnauthorizatedError: status.UNAUTHORIZED,
  ForbiddenOperation: status.FORBIDDEN,
  BusinessConflictError: status.CONFLICT,
};

export const errorHandlerMiddleware = (
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error instanceof DomainError) {
    const statusCode = domainErrorToHttpStatusCode[error.name] ?? status.INTERNAL_SERVER_ERROR;
    return response.status(statusCode).json({ message: error.message });
  }

  if (error instanceof z.ZodError) {
    const errorMessage = z.flattenError(error).fieldErrors;
    return response.status(status.BAD_REQUEST).json({ message: errorMessage });
  }

  Sentry.captureException(error, {
    extra: {
      path: request.path,
      method: request.method,
      user: request.user?.id,
    },
  });
  return response.status(status.INTERNAL_SERVER_ERROR).json({ message: JSON.stringify(error) });
};
