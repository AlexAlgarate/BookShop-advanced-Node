import { schedule } from 'node-cron';
import { priceReductionJobController } from './controllers/jobs/price-reduction-job-controller';

export const startCronJobs = (): void => {
  const weeklyPriceReductionJob = '0 10 * * 1';
  // const testPriceReductionJob = '* * * * *';

  schedule(weeklyPriceReductionJob, async () => {
    await priceReductionJobController();
  });
  console.log('Cron jobs started!');
};
