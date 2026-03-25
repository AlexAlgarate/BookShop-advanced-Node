import request from 'supertest';
import { getTestApp } from '@tests/setup';
import { createBookResponseSchema, deleteBookResponseSchema } from '../schemas/test-schemas';
import { createBookWithUser, getAuthToken } from '@tests/helpers';

describe('DELETE /books/:bookId', () => {
  const BOOKS_URL = '/books';
  test('Given no authorization header, endpoint should return a 401 status code', async () => {
    const { book } = await createBookWithUser();
    const createdBook = createBookResponseSchema.parse(book.body as unknown);

    const response = await request(getTestApp())
      .delete(`${BOOKS_URL}/${createdBook.content.id}`)
      .send();

    expect(response.status).toBe(401);
  });

  test('Given an invalid token, endpoint should return a 401 status code', async () => {
    const { book } = await createBookWithUser();
    const createdBook = createBookResponseSchema.parse(book.body as unknown);
    const invalidToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

    const response = await request(getTestApp())
      .delete(`${BOOKS_URL}/${createdBook.content.id}`)
      .set('Authorization', invalidToken)
      .send();

    expect(response.status).toBe(401);
  });

  test('Should return 404 when book does not exist', async () => {
    const token = await getAuthToken();

    const response = await request(getTestApp())
      .delete(`${BOOKS_URL}/6979054b067bd17c70d31fbf`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('Should delete a book and return 204', async () => {
    const { book, token } = await createBookWithUser();
    const createdBook = createBookResponseSchema.parse(book.body as unknown);

    const response = await request(getTestApp())
      .delete(`${BOOKS_URL}/${createdBook.content.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);

    const validateResponse = deleteBookResponseSchema.parse(response.body);

    expect(validateResponse.message).toBe('Book removed successfully');
  });

  test('Should actually remove the book', async () => {
    const { book, token } = await createBookWithUser();
    const createdBook = createBookResponseSchema.parse(book.body as unknown);

    await request(getTestApp())
      .delete(`${BOOKS_URL}/${createdBook.content.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    const getResponse = await request(getTestApp()).get(`${BOOKS_URL}/${createdBook.content.id}`);

    expect(getResponse.status).toBe(404);
  });

  test('Given a user that is not the book owner, return a Forbidden operation errpr', async () => {
    const { book } = await createBookWithUser();
    const createdBookUserA = createBookResponseSchema.parse(book.body as unknown);

    const tokenUserB = await getAuthToken();

    const response = await request(getTestApp())
      .delete(`${BOOKS_URL}/${createdBookUserA.content.id}`)
      .set('Authorization', `Bearer ${tokenUserB}`)
      .send();

    expect(response.status).toBe(403);
  });
});
