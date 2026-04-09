import express, { Application, json } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import bookRouter from './routes/book-routes';
import authenticationRouter from './routes/authentication-routes';
import { errorHandlerMiddleware } from './middlewares/error-handler-middleware';
import { httpsRedirectMiddleware } from './middlewares/https-redirect-middleware';
import { environmentService } from '@infrastructure/services/environment-service';
import userBookRouter from './routes/user-book-routes';
import { LoggerService } from '@domain/services/LoggerService';

export const createApp = (): Application => {
  const API_VERSION = '/api/v1';

  const app = express();

  const { ENVIRONMENT } = environmentService.get();
  const helmetConfig = {
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  };

  app.use(helmet(ENVIRONMENT === 'production' ? helmetConfig : { hsts: false }));

  app.use(
    cors({
      origin: environmentService.get().CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(json({ limit: '10kb' }));

  app.use(httpsRedirectMiddleware);

  app.use(`${API_VERSION}/books`, bookRouter);
  app.use(`${API_VERSION}/authentication`, authenticationRouter);
  app.use(`${API_VERSION}/me`, userBookRouter);

  app.use(errorHandlerMiddleware);

  return app;
};

export const startHttpApi = (app: Application, logger: LoggerService): void => {
  const { API_PORT } = environmentService.get();
  app.listen(API_PORT, () => {
    logger.log(`Up & running on port: ${API_PORT}`);
  });
};
