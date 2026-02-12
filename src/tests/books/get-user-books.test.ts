import request from 'supertest';
import { createRandomBook } from './helper';
import { app } from '@ui/api';
import { faker } from '@faker-js/faker';

describe('GET /me/books', () => {
  const ME_BOOKS_URL = '/me/books';

  test('Given no authorization header, should return 401 status code', async () => {
    const response = await request(app).get(ME_BOOKS_URL);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test('Given an invalid token, should return 401 status code', async () => {
    const invalidToken = '1234';

    const response = await request(app)
      .get(ME_BOOKS_URL)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(401);
  });

  test('Given a malformed authorization header, should return 401 status code', async () => {
    const response = await request(app)
      .get(ME_BOOKS_URL)
      .set('Authorization', 'Invalid-header invalid-token');

    expect(response.status).toBe(401);
  });

  test('Given a valid token, should return 200 status code', async () => {
    const { token } = await createRandomBook();

    const response = await request(app).get(ME_BOOKS_URL).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  test('Should return empty array when user has no books', async () => {
    const { token } = await createRandomBook();

    const response = await request(app).get(ME_BOOKS_URL).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.content)).toBe(true);
    expect(response.body.content).toHaveLength(0);
  });

  test('Should returning only books belonging to the authorizated user', async () => {
    const { token: tokenUserA, newRandomBook: bookUserA } = await createRandomBook();
    const titleA = bookUserA.body.content.title;

    const book2Payload = {
      title: faker.book.title(),
      description: faker.commerce.productDescription(),
      price: 50,
      author: faker.book.author(),
    };

    await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send(book2Payload);

    const { newRandomBook: bookUserB } = await createRandomBook();
    const titleB = bookUserB.body.content.title;

    const response = await request(app)
      .get(ME_BOOKS_URL)
      .set('Authorization', `Bearer ${tokenUserA}`);

    expect(response.status).toBe(200);
    expect(response.body.content).toHaveLength(2);

    const titles = response.body.content.map((b: any) => b.title);
    expect(titles).toContain(titleA);
    expect(titles).toContain(book2Payload.title);

    expect(titles).not.toContain(titleB);
  });

  test('Should return books with correct structure', async () => {
    const { token } = await createRandomBook();

    const response = await request(app).get(ME_BOOKS_URL).set('Authorization', `Bearer ${token}`);

    const book = response.body.content[0];

    expect(response.status).toBe(200);
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

  test('Should not expose sensitive information (_id)', async () => {
    const { token } = await createRandomBook();

    const response = await request(app).get(ME_BOOKS_URL).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    const book = response.body.content[0];
    expect(book).not.toHaveProperty('_id');
    expect(book).not.toHaveProperty('_v');
  });

  test('Should return paginated results', async () => {
    const { token } = await createRandomBook();

    const booksToCreate = Array.from({ length: 23 }).map(() => ({
      title: faker.book.title(),
      description: faker.commerce.productDescription(),
      price: 20,
      author: faker.book.author(),
    }));

    for (const book of booksToCreate) {
      await request(app).post('/books').set('Authorization', `Bearer ${token}`).send(book);
    }

    const response = await request(app)
      .get(`${ME_BOOKS_URL}?page=1&limit=10`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.content).toHaveLength(10);
    expect(response.body.meta.total).toBe(24);
    expect(response.body.meta.page).toBe(3);
  });
});
