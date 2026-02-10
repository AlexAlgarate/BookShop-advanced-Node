import * as z from 'zod';

export const authenticationBodySchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

export type AuthenticationBody = z.infer<typeof authenticationBodySchema>;
