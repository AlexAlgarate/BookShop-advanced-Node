import { FindBooksUseCase } from '@domain/use-cases/books/find-books-usecase';
import { BookFactory } from '@ui/factories/book-factory';
import { Response, Request } from 'express';
import * as z from 'zod';
// import { MailtrapService } from '@infrastructure/services/email-service';

const findBooksValidator = z.object({
  page: z.coerce.number().min(1).default(1).catch(1),
  limit: z.coerce.number().min(1).max(100).default(10).catch(10),
  search: z.string().optional(),
});

export const findBooksController = async (request: Request, response: Response) => {
  const { page, limit, search } = findBooksValidator.parse(request.query);

  const bookRepository = BookFactory.createRepository();
  const findBookUseCase = new FindBooksUseCase(bookRepository);

  const paginatedBooks = await findBookUseCase.execute({ page, limit, search });

  response.json(paginatedBooks);
};
