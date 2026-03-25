import request from 'supertest';
import { getTestApp } from '@tests/setup';
import { findBooksResponseSchema } from '../schemas/test-schemas';
import { createBookWithUser } from '@tests/helpers';

describe('GET /books', () => {
  const BOOKS_URL = '/books';

  describe('Public access', () => {
    test('Should not require authentication', async () => {
      const response = await request(getTestApp()).get(BOOKS_URL);

      expect(response.status).not.toBe(401);
      expect(response.status).toBe(200);
    });

    test('Sould return an empty array when there are no books', async () => {
      const response = await request(getTestApp()).get(BOOKS_URL);
      expect(response.status).toBe(200);

      const validateResponse = findBooksResponseSchema.parse(response.body);
      expect(validateResponse.content.length).toBe(0);
    });
  });

  test('Should return 200 and a list of books', async () => {
    await createBookWithUser();
    await createBookWithUser();
    await createBookWithUser(undefined, { status: 'SOLD', soldAt: new Date().toISOString() });

    const response = await request(getTestApp()).get(BOOKS_URL);
    expect(response.status).toBe(200);

    const validateResponse = findBooksResponseSchema.parse(response.body);
    const books = validateResponse.content;

    expect(books.length).toBe(3);
    expect(books.every(book => book.status === 'PUBLISHED')).toBe(true);
    expect(books.some(book => book.status === 'SOLD')).toBe(false);
  });

  test('Should return only PUBLISHED books', async () => {
    await createBookWithUser();
    await createBookWithUser();

    const response = await request(getTestApp()).get(BOOKS_URL);
    expect(response.status).toBe(200);

    const validateResponse = findBooksResponseSchema.parse(response.body);
    const books = validateResponse.content;
    expect(books.length).toBeGreaterThan(0);
    expect(books.every(book => book.status === 'PUBLISHED')).toBe(true);
  });

  test('Should allow searching by title', async () => {
    const { book } = await createBookWithUser();
    const title = book.title;

    const response = await request(getTestApp()).get(`${BOOKS_URL}/?search=${title}`);

    const validateResponse = findBooksResponseSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(validateResponse.content.some(book => book.title.includes(title))).toBe(true);
  });

  test('Should allow searching by author', async () => {
    const { book } = await createBookWithUser();
    const author = book.author;

    const response = await request(getTestApp()).get(`${BOOKS_URL}/?search=${author}`);
    const validateResponse = findBooksResponseSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(validateResponse.content.some(book => book.author.includes(author))).toBe(true);
  });

  test('Should return paginated results (default pagination)', async () => {
    const response = await request(getTestApp()).get(BOOKS_URL);
    const validateResponse = findBooksResponseSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(validateResponse.meta).toBeDefined();
    expect(validateResponse.meta.page).toBeDefined();
    expect(validateResponse.meta.limit).toBeDefined();
    expect(validateResponse.meta.total).toBeDefined();
  });

  test('Should respect page and limit query params', async () => {
    await Promise.all(Array.from({ length: 12 }).map(() => createBookWithUser()));

    const response = await request(getTestApp()).get(`${BOOKS_URL}?page=1&limit=5`);
    const validateResponse = findBooksResponseSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(validateResponse.content.length).toBeLessThanOrEqual(5);
    expect(validateResponse.meta.page).toBe(1);
    expect(validateResponse.meta.limit).toBe(5);
  });

  test('Should return empty array when page exceeds total pages', async () => {
    await createBookWithUser();

    const response = await request(getTestApp()).get(`${BOOKS_URL}?page=999&limit=5`);
    const validateResponse = findBooksResponseSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(validateResponse.content.length).toBe(0);
  });

  test('Should fallback to defaults when page or limit is invalid', async () => {
    const response = await request(getTestApp()).get(`${BOOKS_URL}?page=-1&limit=abc`);
    const validateResponse = findBooksResponseSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(validateResponse.meta.page).toBeGreaterThan(0);
  });
});
