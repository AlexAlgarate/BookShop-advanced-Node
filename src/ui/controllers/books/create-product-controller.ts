import { CreateBookUseCase } from '@domain/use-cases/books/create-book-usecase';
import { BookFactory } from '@ui/factories/book-factory';

import { authenticatedUserSchema, createBookBodySchema } from '@ui/validators/book-validators';
import { Request, Response } from 'express';

export const createProductController = async (
  request: Request,
  response: Response
): Promise<void> => {
  const validateBody = createBookBodySchema.parse(request.body);

  const { id: userId } = authenticatedUserSchema.parse(request.user);

  const bookRepository = BookFactory.createRepository();
  const createBookUseCase = new CreateBookUseCase(bookRepository);

  const createdBook = await createBookUseCase.execute({
    title: validateBody.title,
    description: validateBody.description,
    price: validateBody.price,
    author: validateBody.author,
    ownerId: userId,
  });

  response.status(201).json({ content: createdBook });
};
