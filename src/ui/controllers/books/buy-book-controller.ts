import { BuyBookUseCase } from '@domain/use-cases/books/buy-book-usecase';
import { AuthenticationFactory } from '@ui/factories/authentication-factory';
import { BookFactory } from '@ui/factories/book-factory';
import { authenticatedUserSchema, bookIdParamsSchema } from '@ui/validators/book-validators';
import { Request, Response } from 'express';

export const buyBookController = async (request: Request, response: Response): Promise<void> => {
  const { bookId } = bookIdParamsSchema.parse(request.params);
  const { id: buyerId } = authenticatedUserSchema.parse(request.user);

  const bookRepository = BookFactory.createRepository();
  const userRepository = AuthenticationFactory.createUserRepository();
  const emailService = AuthenticationFactory.createEmailService();

  const buyBookUseCase = new BuyBookUseCase(bookRepository, userRepository, emailService);

  const updatedBook = await buyBookUseCase.execute({ bookId, buyerId });

  response.json({ content: updatedBook });
};
