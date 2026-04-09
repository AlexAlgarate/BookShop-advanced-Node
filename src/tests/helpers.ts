import request, { Test, Response } from 'supertest';
import { faker } from '@faker-js/faker';
import {
  BookOverrides,
  createBookResponseSchema,
  signinResponseSchema,
  Book,
} from '@tests/schemas/test-schemas';
import { getTestApp } from '@tests/setup';

const API_PREFIX = '/api/v1';
export const API_SIGNUP_URL = `${API_PREFIX}/authentication/signup`;
export const API_SIGNIN_URL = `${API_PREFIX}/authentication/signin`;

export const API_BOOKS_URL = `${API_PREFIX}/books`;
export const API_ME_BOOKS_URL = `${API_PREFIX}/me/books`;

export const NON_EXISTING_BOOK_ID = '6979054b067bd17c70d31fbf';

export const VALID_PASSWORD = 'Qwertyui1.';

type BookPayload = {
  title: string;
  description: string;
  price: number;
  author: string;
} & BookOverrides;

export const signup = (email = faker.internet.email(), password = VALID_PASSWORD): Test =>
  request(getTestApp()).post(API_SIGNUP_URL).send({ email, password });

export const login = (email: string, password = VALID_PASSWORD): Test =>
  request(getTestApp()).post(API_SIGNIN_URL).send({ email, password });

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
    .post(API_BOOKS_URL)
    .set('Authorization', `Bearer ${token}`)
    .send(buildBookPayload(overrides));

export const createBookWithUser = async (
  email?: string,
  overrides: BookOverrides = {}
): Promise<{ response: Response; token: string; bookId: string; book: Book }> => {
  const token = await getAuthToken(email);
  const response = await createBook(token, overrides);
  const parsedBook = createBookResponseSchema.parse(response.body);
  return { response, token, bookId: parsedBook.content.id, book: parsedBook.content };
};
