import { FindUserBooksUseCase } from '@domain/use-cases/books/find-user-book-usecase';
import { BookFactory } from '@ui/factories/book-factory';
import { authenticatedUserSchema, findBooksBodySchema } from '@ui/validators/book-validators';
import { Request, Response } from 'express';

export const findUserBooksController = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { page, limit, search, author, title } = findBooksBodySchema.parse(request.query);
  const { id: userId } = authenticatedUserSchema.parse(request.user);

  const bookRepository = BookFactory.createRepository();
  const findUserBooksUseCase = new FindUserBooksUseCase(bookRepository);

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
