import request from 'supertest';
import { createRandomBook } from './helper';
import { app } from '@ui/api';

describe('GET /books', () => {
  const BOOKS_URL = '/books';

  test('Sould return an empty array when there are no books', async () => {
    const response = await request(app).get(BOOKS_URL);

    expect(response.body.content.length).toBe(0);
  });

  test('Should return 200 and a list of books', async () => {
    await createRandomBook();
    await createRandomBook();

    const response = await request(app).get(BOOKS_URL);

    expect(response.status).toBe(200);
    expect(response.body.content.length).toBe(2);
  });

  test('Should return onlye PUBLISHED books', async () => {
    await createRandomBook();
    await createRandomBook();

    const response = await request(app).get(BOOKS_URL);

    expect(response.status).toBe(200);

    const books = response.body.content;
    expect(books.length).toBeGreaterThan(0);
    expect(books.every((book: any) => book.status === 'PUBLISHED')).toBe(true);
  });

  test('Should allow searching by title', async () => {
    const { newRandomBook } = await createRandomBook();

    const response = await request(app).get(
      `${BOOKS_URL}/?search=${newRandomBook.body.content.title}`
    );

    expect(response.status).toBe(200);
    expect(
      response.body.content.some((book: any) =>
        book.title.includes(newRandomBook.body.content.title)
      )
    ).toBe(true);
  });

  test('Should allow searching by author', async () => {
    const { newRandomBook } = await createRandomBook();
    const author = newRandomBook.body.content.author;

    const response = await request(app).get(`${BOOKS_URL}/?search=${author}`);

    expect(response.status).toBe(200);
    expect(response.body.content.some((book: any) => book.author.includes(author))).toBe(true);
  });

  test('Should return paginated results (default pagination)', async () => {
    const response = await request(app).get(BOOKS_URL);

    expect(response.status).toBe(200);
    expect(response.body.meta).toBeDefined();
    expect(response.body.meta.page).toBeDefined();
    expect(response.body.meta.limit).toBeDefined();
    expect(response.body.meta.total).toBeDefined();
  });

  test('Should respect page and limit query params', async () => {
    await Promise.all(Array.from({ length: 12 }).map(() => createRandomBook()));

    const response = await request(app).get(`${BOOKS_URL}?page=1&limit=5`);

    expect(response.status).toBe(200);
    expect(response.body.content.length).toBeLessThanOrEqual(5);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(5);
  });

  test('Should not require authentication', async () => {
    const response = await request(app).get(BOOKS_URL);

    expect(response.status).not.toBe(401);
  });

  test('Should return consistent book shape', async () => {
    await createRandomBook();

    const response = await request(app).get(BOOKS_URL);

    expect(response.status).toBe(200);

    const book = response.body.content[0];

    expect(book).toHaveProperty('id');
    expect(book).toHaveProperty('title');
    expect(book).toHaveProperty('description');
    expect(book).toHaveProperty('price');
    expect(book).toHaveProperty('author');
    expect(book).toHaveProperty('status');
    expect(book).toHaveProperty('ownerId');
    expect(book).toHaveProperty('soldAt');
    expect(book).toHaveProperty('createdAt');
  });

  test('Should return empty array when page exceeds total pages', async () => {
    await createRandomBook();

    const response = await request(app).get(`${BOOKS_URL}?page=999&limit=5`);

    expect(response.status).toBe(200);
    expect(response.body.content.length).toBe(0);
  });

  test('Should fallback to defaults when page or limit is invalid', async () => {
    const response = await request(app).get(`${BOOKS_URL}?page=-1&limit=abc`);

    expect(response.status).toBe(200);
    expect(response.body.meta.page).toBeGreaterThan(0);
  });
});
