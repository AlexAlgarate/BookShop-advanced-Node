import { useCases } from '@di/use-case-resolver';
import { findBooksBodySchema } from '@ui/validators/book-validators';
import { Response, Request } from 'express';

export const findBooksController = async (request: Request, response: Response): Promise<void> => {
  const { page, limit, search, author, title } = findBooksBodySchema.parse(request.query);

  const paginatedBooks = await useCases.findBooks().execute({ page, limit, search, author, title });

  response.json(paginatedBooks);
};
