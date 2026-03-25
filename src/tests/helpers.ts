import request, { Test, Response } from 'supertest';
import { faker } from '@faker-js/faker';
import { BookOverrides, signinResponseSchema } from './schemas/test-schemas';
import { getTestApp } from '@tests/setup';

export const VALID_PASSWORD = 'Qwertyui1.';

type BookPayload = {
  title: string;
  description: string;
  price: number;
  author: string;
} & BookOverrides;

export const signup = (email = faker.internet.email(), password = VALID_PASSWORD): Test =>
  request(getTestApp()).post('/authentication/signup').send({ email, password });

export const login = (email: string, password = VALID_PASSWORD): Test =>
  request(getTestApp()).post('/authentication/signin').send({ email, password });

export const getAuthToken = async (email = faker.internet.email()): Promise<string> => {
  await signup(email);
  const response = await login(email);
  return signinResponseSchema.parse(response.body).content;
};

export const buildBookPayload = (overrides: BookOverrides = {}): BookPayload => ({
  title: faker.book.title(),
  description: faker.commerce.productDescription(),
  price: parseInt(faker.commerce.price(), 10),
  author: faker.book.author(),
  ...overrides,
});

export const createBook = (token: string, overrides: BookOverrides = {}): Test =>
  request(getTestApp())
    .post('/books')
    .set('Authorization', `Bearer ${token}`)
    .send(buildBookPayload(overrides));

export const createBookWithUser = async (
  email?: string,
  overrides: BookOverrides = {}
): Promise<{ book: Response; token: string }> => {
  const token = await getAuthToken(email);
  const book = await createBook(token, overrides);
  return { book, token };
};
