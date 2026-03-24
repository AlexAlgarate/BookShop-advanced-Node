import { rateLimit } from 'express-rate-limit';

const isTestEnvironment = process.env.NODE_ENV === 'test';

const skipRateLimit = (): boolean => isTestEnvironment;

export const siginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: 'Too many login attempts, please try again later in 15 minutes.',
  skip: skipRateLimit,
});

export const sigupRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: 'Too many accounts created, try again later in 15 minutes.',
  skip: skipRateLimit,
});
