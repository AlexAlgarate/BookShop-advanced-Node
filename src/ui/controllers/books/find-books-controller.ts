import { FindBooksUseCase } from '@domain/use-cases/books/find-books-usecase';
import { BookFactory } from '@ui/factories/book-factory';
import { findBooksBodySchema } from '@ui/validators/book-validators';
import { Response, Request } from 'express';

export const findBooksController = async (request: Request, response: Response) => {
  const { page, limit, search, author, title } = findBooksBodySchema.parse(request.query);

  const bookRepository = BookFactory.createRepository();
  const findBookUseCase = new FindBooksUseCase(bookRepository);

  const paginatedBooks = await findBookUseCase.execute({ page, limit, search, author, title });

  response.json(paginatedBooks);
};
