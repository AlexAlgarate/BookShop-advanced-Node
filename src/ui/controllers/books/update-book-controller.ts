import { container } from '@di/container';
import { UPDATE_BOOK_USE_CASE } from '@di/tokens';
import { UpdateBookUseCase } from '@domain/use-cases/books/update-book-usecase';
import {
  authenticatedUserSchema,
  bookIdParamsSchema,
  updateBookBodySchema,
} from '@ui/validators/book-validators';
import { Response, Request } from 'express';

export const updateBookController = async (request: Request, response: Response): Promise<void> => {
  const { bookId } = bookIdParamsSchema.parse(request.params);
  const { title, description, author, price } = updateBookBodySchema.parse(request.body);
  const { id: userId } = authenticatedUserSchema.parse(request.user);

  const updateBookUseCase = container.get<UpdateBookUseCase>(UPDATE_BOOK_USE_CASE);
  const updateBook = await updateBookUseCase.execute(
    bookId,
    { title, description, author, price },
    userId
  );

  response.json({ content: updateBook });
};