import { container } from '@di/container';
import { FIND_BOOKS_USE_CASE } from '@di/tokens';
import { FindBooksUseCase } from '@application/use-cases/books/find-books-usecase';
import { findBooksBodySchema } from '@ui/validators/book-validators';
import { Response, Request } from 'express';

export const findBooksController = async (request: Request, response: Response): Promise<void> => {
  const { page, limit, search, author, title } = findBooksBodySchema.parse(request.query);

  const findBooksUseCase = container.get<FindBooksUseCase>(FIND_BOOKS_USE_CASE);
  const paginatedBooks = await findBooksUseCase.execute({ page, limit, search, author, title });

  response.json(paginatedBooks);
};