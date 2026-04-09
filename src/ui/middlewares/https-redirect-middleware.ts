import { Request, Response, NextFunction } from 'express';
import { environmentService } from '@infrastructure/services/environment-service';

export const httpsRedirectMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const { ENVIRONMENT } = environmentService.get();

  if (ENVIRONMENT === 'production') {
    if (!request.secure) {
      return response.redirect(301, `https://${request.hostname}${request.originalUrl}`);
    }
  }

  next();
};
