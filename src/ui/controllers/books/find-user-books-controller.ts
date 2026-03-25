import { getControllers } from '@di/controller-factory';
import { authenticatedUserSchema, findBooksBodySchema } from '@ui/validators/book-validators';
import { Request, Response } from 'express';

export const findUserBooksController = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { page, limit, search, author, title } = findBooksBodySchema.parse(request.query);
  const { id: userId } = authenticatedUserSchema.parse(request.user);

  const { findUserBooksUseCase } = getControllers();
  const paginatedUserBooks = await findUserBooksUseCase().execute({
    page,
    limit,
    search,
    author,
    title,
    ownerId: userId,
  });

  response.json(paginatedUserBooks);
};
