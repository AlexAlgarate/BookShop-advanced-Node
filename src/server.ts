import 'reflect-metadata';

import { connectToMongoDb } from '@infrastructure/database/mongo-connection';
import { createApp, startHttpApi } from './ui/api';
import { environmentService } from '@infrastructure/services/environment-service';
import { startCronJobs } from '@ui/cron';
import { initializeSentry } from '@infrastructure/monitoring/sentry.initializer';
import { registerInfrastructureBindings } from '@di/infrastructure-bindings';
import { registerUseCaseBindings } from '@di/usecase-bindings';
import { getLogger } from './infrastructure/services/logger-init';

const logger = getLogger();

const executeApp = async (): Promise<void> => {
  try {
    logger.log('-- Starting application --');
    logger.log('...loading environment');
    environmentService.load();

    initializeSentry();

    registerInfrastructureBindings();
    registerUseCaseBindings();

    await connectToMongoDb();
    startCronJobs();
    const app = createApp();
    startHttpApi(app, logger);
  } catch (error) {
    logger.error('Unable to start application', error as Error);
    process.exit(1);
  }
};

await executeApp();
