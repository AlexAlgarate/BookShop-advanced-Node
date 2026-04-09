import request from 'supertest';
import { getTestApp } from '@tests/setup';
import { errorResponseSchema, updateBookResponseSchema } from '@tests/schemas/test-schemas';
import {
  API_BOOKS_URL,
  createBookWithUser,
  getAuthToken,
  NON_EXISTING_BOOK_ID,
} from '@tests/helpers';

describe('PATCH /books/:bookId', () => {
  describe('Authentication', () => {
    test('Given no authorization header, should return 401', async () => {
      const response = await request(getTestApp())
        .patch(`${API_BOOKS_URL}/${NON_EXISTING_BOOK_ID}`)
        .send({ title: 'new-title' });

      expect(response.status).toBe(401);
    });

    test('Given an invalid token, should return a 401', async () => {
      const response = await request(getTestApp())
        .patch(`${API_BOOKS_URL}/${NON_EXISTING_BOOK_ID}`)
        .set('Authorization', `Bearer invalid-token`)
        .send({ title: 'new-title' });

      expect(response.status).toBe(401);
    });
  });

  describe('Non found', () => {
    test('Given a non existing book, return a 404', async () => {
      const { token } = await createBookWithUser();

      const response = await request(getTestApp())
        .patch(`${API_BOOKS_URL}/${NON_EXISTING_BOOK_ID}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(404);
    });
  });

  test('Given an existing book, should return 200 and updated book', async () => {
    const { token, bookId } = await createBookWithUser();

    const updatedPayload = {
      title: 'Updated title',
      price: 150,
    };

    const response = await request(getTestApp())
      .patch(`${API_BOOKS_URL}/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPayload);

    const validateResponse = updateBookResponseSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(validateResponse.content.title).toBe('Updated title');
    expect(validateResponse.content.price).toBe(150);
  });

  describe('Authorization', () => {
    test('Given an user that is not the book owner, should return 403', async () => {
      const { bookId } = await createBookWithUser();

      const tokenFromAnotherUser = await getAuthToken();

      const response = await request(getTestApp())
        .patch(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${tokenFromAnotherUser}`)
        .send({ title: 'new-title' });

      const validateErrorResponse = errorResponseSchema.parse(response.body);

      expect(response.status).toBe(403);
      expect(validateErrorResponse).toStrictEqual({
        message: 'Only owner of the book can update this book',
      });
    });
  });

  describe('Validation', () => {
    test('Given a negative price, should return 400', async () => {
      const { bookId, token } = await createBookWithUser();

      const response = await request(getTestApp())
        .patch(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ price: -10 });

      expect(response.status).toBe(400);
    });

    test('Given a price of 0, should return 400', async () => {
      const { bookId, token } = await createBookWithUser();

      const response = await request(getTestApp())
        .patch(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ price: 0 });

      expect(response.status).toBe(400);
    });

    test('Given a title shorter than 3 characters, should return 400', async () => {
      const { bookId, token } = await createBookWithUser();

      const response = await request(getTestApp())
        .patch(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'ab' });

      expect(response.status).toBe(400);
    });
    test('Given a title longer than 200 characters, should return 400', async () => {
      const { bookId, token } = await createBookWithUser();

      const response = await request(getTestApp())
        .patch(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'a'.repeat(201) });

      expect(response.status).toBe(400);
    });

    test('Given a description shorter than 10 characters, should return 400', async () => {
      const { bookId, token } = await createBookWithUser();

      const response = await request(getTestApp())
        .patch(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'short' });

      expect(response.status).toBe(400);
    });

    test('Attempting to update ownerId should return 400', async () => {
      const { bookId, token } = await createBookWithUser();

      const response = await request(getTestApp())
        .patch(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ownerId: 'new-owner-id' });

      expect(response.status).toBe(400);

      const validatedError = errorResponseSchema.parse(response.body);
      expect(validatedError.message).toBe('Validation failed');
      expect(validatedError.errors?.formErrors?.[0]).toContain('ownerId');
    });

    test('Attempting to update id should return 400', async () => {
      const { bookId, token } = await createBookWithUser();

      const response = await request(getTestApp())
        .patch(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ id: 'new-id' });

      expect(response.status).toBe(400);
    });

    test('Attempting to update status should return 400', async () => {
      const { bookId, token } = await createBookWithUser();

      const response = await request(getTestApp())
        .patch(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'SOLD' });

      expect(response.status).toBe(400);
    });
  });
});
