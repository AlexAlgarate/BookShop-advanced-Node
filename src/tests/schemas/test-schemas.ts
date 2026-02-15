import * as z from 'zod';

export const signupResponseSchema = z.object({
  content: z.string(),
});

export const signinResponseSchema = z.object({
  content: z.string().min(1),
});

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number().positive(),
  author: z.string(),
  status: z.enum(['PUBLISHED', 'SOLD']),
  ownerId: z.string(),
  soldAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
});

export const buyBookResponseSchema = z.object({
  content: bookSchema,
});

export const createBookResponseSchema = z.object({
  content: bookSchema,
});

export const updateBookResponseSchema = z.object({
  content: bookSchema,
});

export const paginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
});

export const findBooksResponseSchema = z.object({
  content: z.array(bookSchema),
  meta: paginationMetaSchema,
});

export const getUserBooksResponseSchema = z.object({
  content: z.array(bookSchema),
  meta: paginationMetaSchema,
});

export const deleteBookResponseSchema = z.object({
  message: z.string(),
});

export const errorResponseSchema = z.object({
  message: z.string(),
  errors: z
    .object({
      formErrors: z.array(z.string()).optional(),
      fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
    })
    .optional(),
});

export type SignupResponse = z.infer<typeof signupResponseSchema>;
export type SigninResponse = z.infer<typeof signinResponseSchema>;
export type Book = z.infer<typeof bookSchema>;
export type CreateBookResponse = z.infer<typeof createBookResponseSchema>;
export type UpdateBookResponse = z.infer<typeof updateBookResponseSchema>;
export type FindBooksResponse = z.infer<typeof findBooksResponseSchema>;
export type GetUserBooksResponse = z.infer<typeof getUserBooksResponseSchema>;
export type BuyBookResponse = z.infer<typeof buyBookResponseSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type DeleteResponse = z.infer<typeof deleteBookResponseSchema>;
