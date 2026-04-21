import { container } from '@di/container';
import { CREATE_BOOK_USE_CASE } from '@di/tokens';
import { CreateBookUseCase } from '@domain/use-cases/books/create-book-usecase';
import { authenticatedUserSchema, createBookBodySchema } from '@ui/validators/book-validators';
import { Request, Response } from 'express';

export const createBookController = async (request: Request, response: Response): Promise<void> => {
  const validateBody = createBookBodySchema.parse(request.body);
  const { id: userId } = authenticatedUserSchema.parse(request.user);

  const createBookUseCase = container.get<CreateBookUseCase>(CREATE_BOOK_USE_CASE);
  const createdBook = await createBookUseCase.execute({
    title: validateBody.title,
    description: validateBody.description,
    price: validateBody.price,
    author: validateBody.author,
    ownerId: userId,
  });

  response.status(201).json({ content: createdBook });
};