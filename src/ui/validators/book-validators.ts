import * as z from 'zod';

export const createBookBodySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characteres'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1500, 'Description must be less than 200 characteres'),
  price: z.number().positive('Price must be positive').min(0.01, 'Price must be at least 0.01'),
  author: z
    .string()
    .min(1, 'Author is required')
    .max(100, 'Author must be less than 200 characteres'),
});

export const authenticatedUserSchema = z.object({
  id: z.string(),
});

export const bookIdParamsSchema = z.object({
  bookId: z.string(),
});

export const updateBookBodySchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters').optional(),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(1500, 'Description must be at most 150 characters')
      .optional(),
    price: z
      .number()
      .positive('Price must be positive')
      .min(0.01, 'Price must be at least 0.01')
      .optional(),
    author: z
      .string()
      .min(1, 'Author is required')
      .max(100, 'Author must be less than 200 characteres')
      .optional(),
  })
  .strict();

export type CreateBookBody = z.infer<typeof createBookBodySchema>;
export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;
export type BookIdParams = z.infer<typeof bookIdParamsSchema>;
export type UpdateBookBody = z.infer<typeof updateBookBodySchema>;
