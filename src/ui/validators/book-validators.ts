import * as z from 'zod';

const noHtml = (val: string): boolean => !/[<>]/.test(val);

export const createBookBodySchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be less than 200 characters')
      .refine(noHtml, 'HTML is not allowed'),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(1500, 'Description must be less than 1500 characters')
      .refine(noHtml, 'HTML is not allowed'),
    price: z.number().positive('Price must be positive').min(0.01, 'Price must be at least 0.01'),
    author: z
      .string()
      .min(1, 'Author is required')
      .max(100, 'Author must be less than 100 characters')
      .refine(noHtml, 'HTML is not allowed'),
  })
  .strict();

export const authenticatedUserSchema = z.object({
  id: z.string(),
});

export const bookIdParamsSchema = z.object({
  bookId: z.string(),
});

export const updateBookBodySchema = z
  .object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must be less than 200 characters')
      .refine(noHtml, 'HTML is not allowed')
      .optional(),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(1500, 'Description must be at most 1500 characters')
      .refine(noHtml, 'HTML is not allowed')
      .optional(),
    price: z
      .number()
      .positive('Price must be positive')
      .min(0.01, 'Price must be at least 0.01')
      .optional(),
    author: z
      .string()
      .min(1, 'Author is required')
      .max(100, 'Author must be less than 100 characters')
      .refine(noHtml, 'HTML is not allowed')
      .optional(),
  })
  .strict();

export const findBooksBodySchema = z.object({
  page: z.coerce.number().min(1).default(1).catch(1).transform(Math.floor),
  limit: z.coerce.number().min(1).max(100).default(10).catch(10).transform(Math.floor),
  search: z.string().refine(noHtml, 'HTML is not allowed').optional(),
  author: z.string().refine(noHtml, 'HTML is not allowed').optional(),
  title: z.string().refine(noHtml, 'HTML is not allowed').optional(),
});

export type FindBookQuery = z.infer<typeof findBooksBodySchema>;
export type CreateBookBody = z.infer<typeof createBookBodySchema>;
export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;
export type BookIdParams = z.infer<typeof bookIdParamsSchema>;
export type UpdateBookBody = z.infer<typeof updateBookBodySchema>;
