import { connectToMongoDb } from '@infrastructure/database/mongo-connection';
import { startHttpApi } from './ui/api';
import { environmentService } from '@infrastructure/services/environment-service';
import { startCronJobs } from '@ui/cron';
import { initializeSentry } from '@infrastructure/monitoring/sentry.initializer';

const executeApp = async (): Promise<void> => {
  try {
    console.log('-- Starting application --');
    console.log('...loading environment');
    environmentService.load();

    initializeSentry();
    await connectToMongoDb();
    startCronJobs();
    startHttpApi();
  } catch (error) {
    console.log('Unable to start application', error);
    process.exit(1);
  }
};

await executeApp();
