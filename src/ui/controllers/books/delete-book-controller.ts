import { container } from '@di/container';
import { DELETE_BOOK_USE_CASE } from '@di/tokens';
import { DeleteBookUseCase } from '@application/use-cases/books/delete-book-usecase';
import { authenticatedUserSchema, bookIdParamsSchema } from '@ui/validators/book-validators';
import { Request, Response } from 'express';

export const deleteBookController = async (request: Request, response: Response): Promise<void> => {
  const { bookId } = bookIdParamsSchema.parse(request.params);
  const { id: userId } = authenticatedUserSchema.parse(request.user);

  const deleteBookUseCase = container.get<DeleteBookUseCase>(DELETE_BOOK_USE_CASE);
  await deleteBookUseCase.execute(bookId, userId);

  response.json({ message: 'Book removed successfully' });
};