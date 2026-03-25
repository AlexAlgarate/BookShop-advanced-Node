import { schedule } from 'node-cron';
import { priceReductionJobController } from './controllers/jobs/price-reduction-job-controller';
import { getLogger } from '@infrastructure/services/logger-init';

const logger = getLogger();

export const startCronJobs = (): void => {
  const weeklyPriceReductionJob = '0 10 * * 1';
  // const testPriceReductionJob = '* * * * *';

  schedule(weeklyPriceReductionJob, async () => {
    await priceReductionJobController();
  });
  logger.log('Cron jobs started!');
};
