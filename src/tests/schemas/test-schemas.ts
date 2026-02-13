import * as z from 'zod';

export const signinResponseSchema = z.object({
  content: z.string().min(1),
});

export const signupResponseSchema = z.object({
  content: z.object({
    id: z.string(),
    email: z.email(),
    createdAt: z.iso.datetime(),
  }),
});

export type SigninResponse = z.infer<typeof signinResponseSchema>;
export type SignupResponse = z.infer<typeof signupResponseSchema>;
