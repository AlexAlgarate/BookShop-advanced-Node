import request from 'supertest';
import { createRandomBook } from './helper';
import { app } from '@ui/api';
import { faker } from '@faker-js/faker';

describe('POST /books', () => {
  const BOOKS_URL = '/books';

  test('Given no authorization header, sould return 401', async () => {
    const response = await request(app).post(BOOKS_URL).send({});

    expect(response.status).toBe(401);
  });

  test('Given an invalid token, should return 401', async () => {
    const response = await request(app)
      .post(BOOKS_URL)
      .set('Authorization', 'Bearer invalid-token')
      .send({});

    expect(response.status).toBe(401);
  });

  test('Given not all book parameters, should return 400', async () => {
    const { token } = await createRandomBook();

    const response = await request(app)
      .post(BOOKS_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: faker.book.title() });

    expect(response.status).toBe(400);
  });

  test('Should return 400 if parameters have invalid types', async () => {
    const { token } = await createRandomBook();

    const response = await request(app)
      .post(BOOKS_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: faker.book.title(),
        description: faker.commerce.productDescription(),
        price: 'not-a-number',
        author: faker.book.author(),
        status: 'PUBLISHED',
        soldAt: null,
      });

    expect(response.status).toBe(400);
  });

  test('Book should be created, returning 201', async () => {
    const { newRandomBook, token } = await createRandomBook();

    const response = await request(app)
      .post(BOOKS_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({ newRandomBook });

    expect(response.status).toBe(201);

    expect(response.body.content.title).toBe(newRandomBook.body.title);
    //!
  });

  test('Initial book status always should be PUBLISHED, instead returns 400', async () => {
    const { newRandomBook, token } = await createRandomBook();
    const invalidBook = { ...newRandomBook, status: 'SOLD' };

    const response = await request(app)
      .post(BOOKS_URL)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBook);

    expect(response.status).toBe(400);
  });

  test('soldAt always should be null when a book is created', async () => {
    const { newRandomBook, token } = await createRandomBook();

    const invalidBook = { ...newRandomBook, soldAt: new Date() };

    const response = await request(app)
      .post(BOOKS_URL)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBook);

    expect(response.status).toBe(400);
  });

  test('The price cannot be negative', async () => {
    const { newRandomBook, token } = await createRandomBook();
    const invalidBook = { ...newRandomBook, price: -10 };

    const response = await request(app)
      .post(BOOKS_URL)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBook);

    expect(response.status).toBe(400);
  });
});
