import { rateLimit } from 'express-rate-limit';

export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many attempts, please try again later in 15 minutes.',
});
