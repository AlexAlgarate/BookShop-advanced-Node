import { getControllers } from '@di/controller-factory';
import { authenticatedUserSchema, bookIdParamsSchema } from '@ui/validators/book-validators';
import { Request, Response } from 'express';

export const deleteBookController = async (request: Request, response: Response): Promise<void> => {
  const { bookId } = bookIdParamsSchema.parse(request.params);
  const { id: userId } = authenticatedUserSchema.parse(request.user);

  const { deleteBookUseCase } = getControllers();
  await deleteBookUseCase().execute(bookId, userId);

  response.json({ message: 'Book removed successfully' });
};
