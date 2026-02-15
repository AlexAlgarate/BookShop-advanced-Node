import { environmentService } from '@infrastructure/services/environment-service';
import * as Sentry from '@sentry/node';

export const initializeSentry = (): void => {
  const { SENTRY_DSN, ENVIRONMENT } = environmentService.get();

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
  });
};
