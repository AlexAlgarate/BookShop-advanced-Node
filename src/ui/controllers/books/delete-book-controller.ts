import { DeleteBookUseCase } from '@domain/use-cases/books/delete-book-usecase';
import { BookFactory } from '@ui/factories/book-factory';
import { authenticatedUserSchema, bookIdParamsSchema } from '@ui/validators/book-validators';
import { Request, Response } from 'express';

export const deleteBookController = async (request: Request, response: Response): Promise<void> => {
  const { bookId } = bookIdParamsSchema.parse(request.params);
  const { id: userId } = authenticatedUserSchema.parse(request.user);

  const bookRepository = BookFactory.createRepository();
  const deleteBookUseCase = new DeleteBookUseCase(bookRepository);

  await deleteBookUseCase.execute(bookId, userId);

  response.json({ message: 'Book removed successfully' });
};
