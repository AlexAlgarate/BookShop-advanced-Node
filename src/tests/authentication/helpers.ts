import { faker } from '@faker-js/faker';
import { getTestApp } from '../setup';
import request from 'supertest';
import * as z from 'zod';

const loginResponseSchema = z.object({
  content: z.string(),
});

export const signupAndLogin = async (
  email: string = faker.internet.email(),
  password: string = 'Qwertyui1.'
): Promise<string> => {
  await request(getTestApp()).post('/authentication/signup').send({ email, password });

  const loginResponse = await request(getTestApp())
    .post('/authentication/signin')
    .send({ email, password });

  const validateResponse = loginResponseSchema.parse(loginResponse.body);
  return validateResponse.content;
};
