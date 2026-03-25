import request from 'supertest';
import { createBookWithUser, getAuthToken } from '@tests/helpers';
import { getTestApp } from '@tests/setup';
import { faker } from '@faker-js/faker';
import { buyBookResponseSchema, errorResponseSchema } from '../schemas/test-schemas';

describe('POST /books/:bookId/buy', () => {
  test('Should return 401 if user is not authenticated', async () => {
    const { book } = await createBookWithUser();
    const validateResponseId = buyBookResponseSchema.parse(book.body);
    const bookId = validateResponseId.content.id;
    const response = await request(getTestApp()).post(`/books/${bookId}/buy`);

    expect(response.status).toBe(401);
  });

  test('Should return 404 if book does not exist', async () => {
    const token = await getAuthToken();
    const fakeBookId = '698f869c9d81e007ef244f4e';

    const response = await request(getTestApp())
      .post(`/books/${fakeBookId}/buy`)
      .set('Authorization', `Bearer ${token}`);

    const validateErrorResponse = errorResponseSchema.parse(response.body);

    expect(response.status).toBe(404);
    expect(validateErrorResponse.message).toContain(
      `Book with id ${fakeBookId} could not be found`
    );
  });

  test('Should return 403 if user tries to buy theis own books', async () => {
    const email = faker.internet.email();
    const { book, token } = await createBookWithUser(email);
    const validateResponseId = buyBookResponseSchema.parse(book.body);
    const bookId = validateResponseId.content.id;

    const response = await request(getTestApp())
      .post(`/books/${bookId}/buy`)
      .set('Authorization', `Bearer ${token}`);

    const validateErrorResponse = errorResponseSchema.parse(response.body);

    expect(response.status).toBe(403);
    expect(validateErrorResponse.message).toBe('You cannot buy your own book');
  });

  test('The book is successfully purchased', async () => {
    const { book } = await createBookWithUser();

    const validateResponseSeller = buyBookResponseSchema.parse(book.body);
    const bookId = validateResponseSeller.content.id;

    const buyerToken = await getAuthToken();

    const response = await request(getTestApp())
      .post(`/books/${bookId}/buy`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(response.status).toBe(200);

    const validateResponse = buyBookResponseSchema.parse(response.body);
    expect(validateResponse.content.ownerId).not.toBe(validateResponseSeller.content.ownerId);
    expect(validateResponse.content.status).toBe('SOLD');

    const { soldAt } = validateResponse.content;
    expect(soldAt).not.toBeNull();
    if (soldAt) {
      expect(new Date(soldAt)).toBeInstanceOf(Date);
    }
  });

  test('Should return 409 if book is already sold', async () => {
    const { book } = await createBookWithUser();
    const validateResponseId = buyBookResponseSchema.parse(book.body);
    const bookId = validateResponseId.content.id;

    const firstBuyerToken = await getAuthToken();
    await request(getTestApp())
      .post(`/books/${bookId}/buy`)
      .set('Authorization', `Bearer ${firstBuyerToken}`);

    const secondBuyerToken = await getAuthToken();
    const response = await request(getTestApp())
      .post(`/books/${bookId}/buy`)
      .set('Authorization', `Bearer ${secondBuyerToken}`);

    const validateErrorResponse = errorResponseSchema.parse(response.body);

    expect(response.status).toBe(409);
    expect(validateErrorResponse.message).toBe('Book is not available for purchase');
  });

  test('Should update book status from PUBLISHED to SOLD', async () => {
    const { book } = await createBookWithUser();
    const validateResponseRandomBook = buyBookResponseSchema.parse(book.body);
    const bookId = validateResponseRandomBook.content.id;

    expect(validateResponseRandomBook.content.status).toBe('PUBLISHED');
    expect(validateResponseRandomBook.content.soldAt).toBeNull();

    const buyerToken = await getAuthToken();

    const response = await request(getTestApp())
      .post(`/books/${bookId}/buy`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(response.status).toBe(200);

    const validateResponse = buyBookResponseSchema.parse(response.body);
    expect(validateResponse.content.status).toBe('SOLD');
    expect(validateResponse.content.soldAt).toBeDefined();
  });
});
