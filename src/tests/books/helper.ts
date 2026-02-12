import request from 'supertest';
import { faker } from '@faker-js/faker';

import { app } from '@ui/api';
import { signupAndLogin } from '../authentication/helpers';

export const createRandomBook = async (email?: string, overrides?: Partial<any>) => {
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
  const newRandomBook = await request(app)
    .post('/books')
    .set('Authorization', `Bearer ${token}`)
    .send(randomBook);

  return { newRandomBook, token, randomBook };
};
