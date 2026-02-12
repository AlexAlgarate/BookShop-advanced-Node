import express, { json } from 'express';

import bookRouter from './routes/book-routes';
import authenticationRouter from './routes/authentication-routes';
import { errorHandlerMiddleware } from './middlewares/error-handler-middleware';
import { environmentService } from '@infrastructure/services/environment-service';
import userBookRouter from './routes/user-book-routes';

export const app = express();

app.use(json());

app.use('/books', bookRouter);
app.use('/authentication', authenticationRouter);
app.use('/me', userBookRouter);

app.use(errorHandlerMiddleware);

export const startHttpApi = (): void => {
  const { API_PORT } = environmentService.get();
  app.listen(API_PORT, () => {
    console.log(`Up & running on port: ${API_PORT}`);
  });
};
