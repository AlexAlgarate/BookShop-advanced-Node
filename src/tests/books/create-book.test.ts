import request from 'supertest';
import { getTestApp } from '@tests/setup';
import { faker } from '@faker-js/faker';
import { createBookResponseSchema } from '../schemas/test-schemas';
import {
  API_BOOKS_URL,
  buildBookPayload,
  createBook,
  createBookWithUser,
  getAuthToken,
} from '@tests/helpers';

describe('POST /books', () => {
  describe('Authentication', () => {
    test('Given no authorization header, sould return 401', async () => {
      const response = await request(getTestApp()).post(API_BOOKS_URL).send(buildBookPayload());

      expect(response.status).toBe(401);
    });

    test('Given an invalid token, should return 401', async () => {
      const response = await request(getTestApp())
        .post(API_BOOKS_URL)
        .set('Authorization', 'Bearer invalid-token')
        .send(buildBookPayload());

      expect(response.status).toBe(401);
    });
  });

  test('Book should be created, returning 201', async () => {
    const token = await getAuthToken();
    const payload = buildBookPayload();

    const response = await createBook(token, payload);

    const validateResponse = createBookResponseSchema.parse(response.body);

    expect(response.status).toBe(201);
    expect(validateResponse.content.title).toBe(payload.title);
    expect(validateResponse.content.price).toBe(payload.price);
    expect(validateResponse.content.description).toBeDefined();
    expect(validateResponse.content.author).toBe(payload.author);
  });

  test('Created book should always have PUBLISHED status', async () => {
    const token = await getAuthToken();

    const response = await createBook(token);
    const validated = createBookResponseSchema.parse(response.body);

    expect(validated.content.status).toBe('PUBLISHED');
  });

  test('Created book should always have null soldAt', async () => {
    const token = await getAuthToken();

    const response = await createBook(token);
    const validated = createBookResponseSchema.parse(response.body);

    expect(validated.content.soldAt).toBeNull();
  });
  describe('Validation', () => {
    test('Given no payload, should return 400', async () => {
      const token = await getAuthToken();

      const response = await request(getTestApp())
        .post(API_BOOKS_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
    });

    test('Given a partial payload, should return 400', async () => {
      const token = await getAuthToken();

      const response = await request(getTestApp())
        .post(API_BOOKS_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: faker.book.title() });

      expect(response.status).toBe(400);
    });

    test('Given a negative price, should return 400', async () => {
      const token = await getAuthToken();

      const response = await request(getTestApp())
        .post(API_BOOKS_URL)
        .set('Authorization', `Bearer ${token}`)
        .send(buildBookPayload({ price: -2 }));

      expect(response.status).toBe(400);
    });

    test('Given a price of 0, should return 400', async () => {
      const token = await getAuthToken();

      const response = await request(getTestApp())
        .post(API_BOOKS_URL)
        .set('Authorization', `Bearer ${token}`)
        .send(buildBookPayload({ price: 0 }));

      expect(response.status).toBe(400);
    });

    test('Given a non-numeric price, should return 400', async () => {
      const token = await getAuthToken();

      const response = await request(getTestApp())
        .post(API_BOOKS_URL)
        .set('Authorization', `Bearer ${token}`)
        .send(buildBookPayload({ price: 'not-a-number' as unknown as number }));

      expect(response.status).toBe(400);
    });

    test('Given a title longer than 200 characters, should return 400', async () => {
      const token = await getAuthToken();

      const response = await request(getTestApp())
        .post(API_BOOKS_URL)
        .set('Authorization', `Bearer ${token}`)
        .send(buildBookPayload({ title: 'q'.repeat(201) }));

      expect(response.status).toBe(400);
    });

    test('Given a status field in the payload, should return 400', async () => {
      const { token, book } = await createBookWithUser();

      const response = await request(getTestApp())
        .post(API_BOOKS_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...book, status: 'SOLD' });

      expect(response.status).toBe(400);
    });

    test('Given a soldAt field in the payload, should return 400', async () => {
      const { token, book } = await createBookWithUser();

      const response = await request(getTestApp())
        .post(API_BOOKS_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...book, soldAt: new Date().toISOString() });

      expect(response.status).toBe(400);
    });
  });

  describe('Business rules', () => {
    test('The same user can create multiple books', async () => {
      const token = await getAuthToken();

      const response1 = await createBook(token);
      const response2 = await createBook(token);

      expect(response1.status).toBe(201);
      expect(response2.status).toBe(201);
    });
    test('Multiple users can create books with the same title', async () => {
      const sharedTitle = faker.book.title();

      const token1 = await getAuthToken();
      const token2 = await getAuthToken();

      const response1 = await createBook(token1, { title: sharedTitle });
      const response2 = await createBook(token2, { title: sharedTitle });

      expect(response1.status).toBe(201);
      expect(response2.status).toBe(201);
    });
  });
});
