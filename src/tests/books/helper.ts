import request from 'supertest';
import { faker } from '@faker-js/faker';

import { app } from '@ui/api';
import { signupAndLogin } from '../authentication/helpers';

export const createRandomBook = async () => {
  const token = await signupAndLogin();

  const randomBook = {
    title: faker.book.title(),
    description: faker.commerce.productDescription(),
    price: parseInt(faker.commerce.price(), 10),
    author: faker.book.author(),
    status: 'PUBLISHED' as const,
    soldAt: null,
  };
  const newRandomBook = await request(app)
    .post('/books')
    .set('Authorization', `Bearer ${token}`)
    .send(randomBook);

  return { newRandomBook, token };
};
