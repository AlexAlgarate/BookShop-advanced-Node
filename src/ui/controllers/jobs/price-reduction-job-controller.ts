import { container } from '@di/container';
import { SEND_PRICE_REDUCTION_USE_CASE } from '@di/tokens';
import { SendPriceReductionSuggestionUseCase } from '@application/use-cases/books/send-price-reduction-suggestion-usecase';
import { getLogger } from '@infrastructure/services/logger-init';

const logger = getLogger();

export const priceReductionJobController = async (): Promise<void> => {
  logger.log('Initializing price reduction suggestion job...');

  try {
    const sendPriceReductionUseCase = container.get<SendPriceReductionSuggestionUseCase>(SEND_PRICE_REDUCTION_USE_CASE);
    await sendPriceReductionUseCase.execute();
    logger.log('Price reduction suggestion emails sent successfully!');
  } catch (error) {
    logger.error('Error sending price reduction suggestions:', error as Error);
  }
};