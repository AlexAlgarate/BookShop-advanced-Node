import request from 'supertest';
import { faker } from '@faker-js/faker';

import { getTestApp } from '../setup';
import { signupAndLogin } from '../authentication/helpers';
import * as z from 'zod';
import { bookSchema } from '../schemas/test-schemas';

type Book = z.infer<typeof bookSchema>;

type CreateRandomBookOverrides = Partial<
  Pick<Book, 'title' | 'description' | 'price' | 'author' | 'status' | 'soldAt'>
>;

export const createRandomBook = async (
  email?: string,
  overrides?: CreateRandomBookOverrides
): Promise<{
  newRandomBook: request.Response;
  token: string;
  randomBook: CreateRandomBookOverrides;
}> => {
  const token = await signupAndLogin(email);

  const randomBook = {
    title: faker.book.title(),
    description: faker.commerce.productDescription(),
    price: parseInt(faker.commerce.price(), 10),
    author: faker.book.author(),
    status: 'PUBLISHED' as const,
    soldAt: null,
    ...overrides,
  };
  const newRandomBook = await request(getTestApp())
    .post('/books')
    .set('Authorization', `Bearer ${token}`)
    .send(randomBook);

  return { newRandomBook, token, randomBook };
};
