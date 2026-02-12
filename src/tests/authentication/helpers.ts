import { faker } from '@faker-js/faker';
import { app } from '@ui/api';
import request from 'supertest';
import * as z from 'zod';

const loginResponseSchema = z.object({
  content: z.string(),
});

export const signupAndLogin = async (
  email: string = faker.internet.email(),
  password: string = '1234'
): Promise<string> => {
  await request(app).post('/authentication/signup').send({ email, password });

  const loginResponse = await request(app).post('/authentication/signin').send({ email, password });

  const validateResponse = loginResponseSchema.parse(loginResponse.body);
  return validateResponse.content;
};
