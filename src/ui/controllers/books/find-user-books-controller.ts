import { FindBooksUseCase } from '@domain/use-cases/books/find-books-usecase';
import { BookFactory } from '@ui/factories/book-factory';
import { authenticatedUserSchema, findBooksBodySchema } from '@ui/validators/book-validators';
import { Request, Response } from 'express';

export const findUserBooksController = async (request: Request, response: Response) => {
  const { page, limit, search, author, title } = findBooksBodySchema.parse(request.query);
  const { id: userId } = authenticatedUserSchema.parse(request.user);

  const bookRepository = BookFactory.createRepository();
  const findUserBooksUseCase = new FindBooksUseCase(bookRepository);

  const paginatedUserBooks = await findUserBooksUseCase.execute({
    page,
    limit,
    search,
    author,
    title,
    ownerId: userId,
  });

  response.json(paginatedUserBooks);
};
