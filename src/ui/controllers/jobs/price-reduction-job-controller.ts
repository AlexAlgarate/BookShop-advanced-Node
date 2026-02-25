import { useCases } from '@di/use-case-resolver';

export const priceReductionJobController = async (): Promise<void> => {
  console.log('Initializing price reduction suggestion job...');

  try {
    await useCases.sendPriceReduction().execute();
    console.log('Price reduction suggestion emails sent successfully!');
  } catch (error) {
    console.error('Error sending price reduction suggestions:', error);
  }
};
