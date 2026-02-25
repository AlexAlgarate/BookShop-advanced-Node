import { useCases } from '@di/use-case-resolver';
import { authenticatedUserSchema, bookIdParamsSchema } from '@ui/validators/book-validators';
import { Request, Response } from 'express';

export const deleteBookController = async (request: Request, response: Response): Promise<void> => {
  const { bookId } = bookIdParamsSchema.parse(request.params);
  const { id: userId } = authenticatedUserSchema.parse(request.user);

  await useCases.deleteBook().execute(bookId, userId);

  response.json({ message: 'Book removed successfully' });
};
