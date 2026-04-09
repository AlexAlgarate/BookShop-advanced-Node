import * as z from 'zod';

const MIN_PASSWORD_LENGTH = 8;

const sanitizeString = (val: string): string => {
  return val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const authenticationBodySchema = z.object({
  email: z.email('Invalid email format').transform(sanitizeString),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, 'Password must be at least 4 characters')
    .max(16, 'Password cannot have more than 16 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[0-9]/, 'Password must include at least one number'),
});

export type AuthenticationBody = z.infer<typeof authenticationBodySchema>;
