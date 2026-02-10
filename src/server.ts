import mongoose from 'mongoose';
import * as Sentry from '@sentry/node';

import { startHttpApi } from './ui/api';
import { environmentService } from '@infrastructure/services/environment-service';

const loadEnvironment = (): void => {
  console.log('...loading environment');
  environmentService.load();
  console.log('environment loaded...');
};

const initializeSentry = (): void => {
  const { SENTRY_DSN, ENVIRONMENT } = environmentService.get();

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
  });
};
const connectMongoDb = async (): Promise<void> => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST } = environmentService.get();

  await mongoose.connect(
    `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/db_project?authSource=admin`
  );
  console.log('Mongodb connected!');
};

const executeApp = async (): Promise<void> => {
  try {
    loadEnvironment();
    initializeSentry();
    await connectMongoDb();
    startHttpApi();
  } catch (error) {
    console.log('Unable to start application', error);
    process.exit(1);
  }
};

await executeApp();
