import request from 'supertest';
import { createBookWithUser, getAuthToken } from '@tests/helpers';
import { getTestApp } from '@tests/setup';
import { buyBookResponseSchema, errorResponseSchema } from '../schemas/test-schemas';

describe('POST /books/:bookId/buy', () => {
  const NON_EXISTENT_BOOK_ID = '698f869c9d81e007ef244f4e';

  describe('Authentication', () => {
    test('Should return 401 if user is not authenticated', async () => {
      const { bookId } = await createBookWithUser();

      const response = await request(getTestApp()).post(`/books/${bookId}/buy`);

      expect(response.status).toBe(401);
    });
  });

  describe('Not found', () => {
    test('Should return 404 if book does not exist', async () => {
      const token = await getAuthToken();

      const response = await request(getTestApp())
        .post(`/books/${NON_EXISTENT_BOOK_ID}/buy`)
        .set('Authorization', `Bearer ${token}`);

      const validateErrorResponse = errorResponseSchema.parse(response.body);

      expect(response.status).toBe(404);
      expect(validateErrorResponse.message).toContain(
        `Book with id ${NON_EXISTENT_BOOK_ID} could not be found`
      );
    });
  });

  describe('Business rules', () => {
    test('Should return 403 if user tries to buy theis own books', async () => {
      const { bookId, token } = await createBookWithUser();

      const response = await request(getTestApp())
        .post(`/books/${bookId}/buy`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);

      const validateErrorResponse = errorResponseSchema.parse(response.body);
      expect(validateErrorResponse.message).toBe('You cannot buy your own book');
    });

    test('Should return 409 if book is already sold', async () => {
      const { bookId } = await createBookWithUser();
      const firstBuyerToken = await getAuthToken();

      await request(getTestApp())
        .post(`/books/${bookId}/buy`)
        .set('Authorization', `Bearer ${firstBuyerToken}`);

      const secondBuyerToken = await getAuthToken();
      const response = await request(getTestApp())
        .post(`/books/${bookId}/buy`)
        .set('Authorization', `Bearer ${secondBuyerToken}`);

      expect(response.status).toBe(409);

      const validateErrorResponse = errorResponseSchema.parse(response.body);
      expect(validateErrorResponse.message).toBe('Book is not available for purchase');
    });
  });

  describe('Successful purchase', () => {
    test('The book is successfully purchased', async () => {
      const { bookId } = await createBookWithUser();

      const buyerToken = await getAuthToken();
      const response = await request(getTestApp())
        .post(`/books/${bookId}/buy`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(200);
    });

    test('Should update book status from PUBLISHED to SOLD', async () => {
      const { bookId, book } = await createBookWithUser();

      expect(book.status).toBe('PUBLISHED');
      expect(book.soldAt).toBeNull();

      const buyerToken = await getAuthToken();

      const response = await request(getTestApp())
        .post(`/books/${bookId}/buy`)
        .set('Authorization', `Bearer ${buyerToken}`);

      const validateResponse = buyBookResponseSchema.parse(response.body);
      expect(validateResponse.content.status).toBe('SOLD');
      expect(validateResponse.content.soldAt).toBeDefined();
    });

    test('soldAt should be set to a valid date after purchase', async () => {
      const { bookId } = await createBookWithUser();

      const buyerToken = await getAuthToken();
      const response = await request(getTestApp())
        .post(`/books/${bookId}/buy`)
        .set('Authorization', `Bearer ${buyerToken}`);

      const validatedResponse = buyBookResponseSchema.parse(response.body);
      expect(validatedResponse.content.soldAt).not.toBeNull();
      expect(new Date(validatedResponse.content.soldAt!)).toBeInstanceOf(Date);
    });

    test('ownerId should transfer to the buyer after purchase', async () => {
      const { bookId, book } = await createBookWithUser();

      const buyerToken = await getAuthToken();
      const response = await request(getTestApp())
        .post(`/books/${bookId}/buy`)
        .set('Authorization', `Bearer ${buyerToken}`);

      const validatedResponse = buyBookResponseSchema.parse(response.body);
      expect(validatedResponse.content.ownerId).not.toBe(book.ownerId);
    });
  });
});
