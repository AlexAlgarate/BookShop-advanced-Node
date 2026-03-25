import { getControllers } from '@di/controller-factory';
import { getLogger } from '@infrastructure/services/logger-init';

const logger = getLogger();

export const priceReductionJobController = async (): Promise<void> => {
  logger.log('Initializing price reduction suggestion job...');

  try {
    const { sendPriceReductionUseCase } = getControllers();
    await sendPriceReductionUseCase().execute();
    logger.log('Price reduction suggestion emails sent successfully!');
  } catch (error) {
    logger.error('Error sending price reduction suggestions:', error as Error);
  }
};
