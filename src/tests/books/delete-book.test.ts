import request from 'supertest';
import { getTestApp } from '@tests/setup';
import { deleteBookResponseSchema } from '../schemas/test-schemas';
import {
  API_BOOKS_URL,
  createBookWithUser,
  getAuthToken,
  NON_EXISTING_BOOK_ID,
} from '@tests/helpers';

describe('DELETE /books/:bookId', () => {
  describe('Authentication', () => {
    test('Given no authorization header, endpoint should return a 401', async () => {
      const response = await request(getTestApp())
        .delete(`${API_BOOKS_URL}/${NON_EXISTING_BOOK_ID}`)
        .send();

      expect(response.status).toBe(401);
    });

    test('Given an invalid token, endpoint should return a 401', async () => {
      const invalidToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

      const response = await request(getTestApp())
        .delete(`${API_BOOKS_URL}/${NON_EXISTING_BOOK_ID}`)
        .set('Authorization', invalidToken)
        .send();

      expect(response.status).toBe(401);
    });
  });

  describe('Not found', () => {
    test('Given a non-existent book id, should return 404', async () => {
      const token = await getAuthToken();

      const response = await request(getTestApp())
        .delete(`${API_BOOKS_URL}/${NON_EXISTING_BOOK_ID}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('Successful deletion', () => {
    test('Should delete a book and return 204', async () => {
      const { bookId, token } = await createBookWithUser();

      const response = await request(getTestApp())
        .delete(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);

      const validateResponse = deleteBookResponseSchema.parse(response.body);
      expect(validateResponse.message).toBe('Book removed successfully');
    });

    test('After deletion, the book should not appear in the public books list', async () => {
      const { bookId, token } = await createBookWithUser();

      await request(getTestApp())
        .delete(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      const getResponse = await request(getTestApp()).get(`${API_BOOKS_URL}/${bookId}`);

      expect(getResponse.status).toBe(404);
    });

    test('Attemping to delete an already-deleted book should return 404', async () => {
      const { bookId, token } = await createBookWithUser();

      await request(getTestApp())
        .delete(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      const secondDelete = await request(getTestApp())
        .delete(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(secondDelete.status).toBe(404);
    });
  });

  describe('Authorization', () => {
    test('Given a user that is not the book owner, should return 403', async () => {
      const { bookId } = await createBookWithUser();

      const tokenUserB = await getAuthToken();

      const response = await request(getTestApp())
        .delete(`${API_BOOKS_URL}/${bookId}`)
        .set('Authorization', `Bearer ${tokenUserB}`)
        .send();

      expect(response.status).toBe(403);

      const validateResponse = deleteBookResponseSchema.parse(response.body);
      expect(validateResponse.message).toBe('Only the owner can delete this book');
    });
  });
});
