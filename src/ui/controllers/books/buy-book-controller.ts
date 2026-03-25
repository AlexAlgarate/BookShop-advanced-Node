import { getControllers } from '@di/controller-factory';
import { authenticatedUserSchema, bookIdParamsSchema } from '@ui/validators/book-validators';
import { Request, Response } from 'express';

export const buyBookController = async (request: Request, response: Response): Promise<void> => {
  const { bookId } = bookIdParamsSchema.parse(request.params);
  const { id: buyerId } = authenticatedUserSchema.parse(request.user);

  const { buyBookUseCase } = getControllers();
  const updatedBook = await buyBookUseCase().execute({ bookId, buyerId });

  response.json({ content: updatedBook });
};
