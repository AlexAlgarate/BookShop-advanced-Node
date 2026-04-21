import { container } from '@di/container';
import { BUY_BOOK_USE_CASE } from '@di/tokens';
import { BuyBookUseCase } from '@application/use-cases/books/buy-book-usecase';
import { authenticatedUserSchema, bookIdParamsSchema } from '@ui/validators/book-validators';
import { Request, Response } from 'express';

export const buyBookController = async (request: Request, response: Response): Promise<void> => {
  const { bookId } = bookIdParamsSchema.parse(request.params);
  const { id: buyerId } = authenticatedUserSchema.parse(request.user);

  const buyBookUseCase = container.get<BuyBookUseCase>(BUY_BOOK_USE_CASE);
  const updatedBook = await buyBookUseCase.execute({ bookId, buyerId });

  response.json({ content: updatedBook });
};