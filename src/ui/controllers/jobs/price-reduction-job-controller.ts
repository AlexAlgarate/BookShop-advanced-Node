import { SendPriceReductionSuggestionUseCase } from '@domain/use-cases/books/send-price-reduction-suggestion-usecase';
import { AuthenticationFactory } from '@ui/factories/authentication-factory';
import { BookFactory } from '@ui/factories/book-factory';

export const priceReductionJobController = async (): Promise<void> => {
  console.log('Initializing price reduction suggestion job...');

  const bookRepository = BookFactory.createRepository();
  const userRepository = AuthenticationFactory.createUserRepository();
  const emailService = AuthenticationFactory.createEmailService();

  const sendPriceReductionSuggestionUseCase = new SendPriceReductionSuggestionUseCase(
    bookRepository,
    userRepository,
    emailService
  );

  try {
    await sendPriceReductionSuggestionUseCase.execute();
    console.log('Price reduction suggestion emails sent successfully!');
  } catch (error) {
    console.error('Error sending price reduction suggestions:', error);
  }
};
