import { useCases } from '@di/use-case-resolver';
import { authenticatedUserSchema, bookIdParamsSchema } from '@ui/validators/book-validators';
import { Request, Response } from 'express';

export const buyBookController = async (request: Request, response: Response): Promise<void> => {
  const { bookId } = bookIdParamsSchema.parse(request.params);
  const { id: buyerId } = authenticatedUserSchema.parse(request.user);

  const updatedBook = await useCases.buyBook().execute({ bookId, buyerId });

  response.json({ content: updatedBook });
};
