import request from 'supertest';
import { createRandomBook } from './helper';
import { app } from '@ui/api';
import { signupAndLogin } from '../authentication/helpers';
import {
  createBookResponseSchema,
  errorResponseSchema,
  updateBookResponseSchema,
} from '../schemas/test-schemas';

describe('PATCH /books/:bookId', () => {
  const BOOKS_URL = '/books';
  test('Given no authorization header, endpoint should return 401 status code', async () => {
    const { newRandomBook } = await createRandomBook();
    const validateBookId = createBookResponseSchema.parse(newRandomBook.body);
    const bookId = validateBookId.content.id;

    const response = await request(app)
      .patch(`${BOOKS_URL}/${bookId}`)

      .send({ title: 'new-title' });

    expect(response.status).toBe(401);
  });

  test('Given an invalid token, endpoint should return a 401 status code', async () => {
    const { newRandomBook } = await createRandomBook();
    const validateBookId = createBookResponseSchema.parse(newRandomBook.body);
    const bookId = validateBookId.content.id;

    const response = await request(app)
      .patch(`${BOOKS_URL}/${bookId}`)
      .set('Authorization', `Bearer invalid-token`)
      .send({ title: 'new-title' });

    expect(response.status).toBe(401);
  });

  test('Given a non existing book, return a 404 status code', async () => {
    const { token } = await createRandomBook();

    const response = await request(app)
      .patch(`${BOOKS_URL}/${'6979054b067bd17c70d31fbf'}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(404);
  });

  test('Given an existing book, should return 200 and updated book', async () => {
    const { token, newRandomBook } = await createRandomBook();
    const validateBookId = createBookResponseSchema.parse(newRandomBook.body);
    const bookId = validateBookId.content.id;

    const updatedPayload = {
      title: 'Updated title',
      price: 150,
    };

    const response = await request(app)
      .patch(`${BOOKS_URL}/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPayload);

    const validateResponse = updateBookResponseSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(validateResponse.content.title).toBe('Updated title');
    expect(validateResponse.content.price).toBe(150);
  });

  test('Given an user that is not the book owner, return a 403 status code', async () => {
    const { newRandomBook } = await createRandomBook();
    const validateBookId = createBookResponseSchema.parse(newRandomBook.body);
    const bookId = validateBookId.content.id;

    const tokenFromAnotherUser = await signupAndLogin('other-user@test.com', 'other-password');

    const response = await request(app)
      .patch(`${BOOKS_URL}/${bookId}`)
      .set('Authorization', `Bearer ${tokenFromAnotherUser}`)
      .send({ title: 'new-title' });

    const validateErrorResponse = errorResponseSchema.parse(response.body);

    expect(response.status).toBe(403);
    expect(validateErrorResponse).toStrictEqual({
      message: 'Only owner of the book can update this book',
    });
  });

  test('Given an invalid payload, should return a 400', async () => {
    const { newRandomBook, token } = await createRandomBook();
    const validateBookId = createBookResponseSchema.parse(newRandomBook.body);
    const bookId = validateBookId.content.id;

    const response = await request(app)
      .patch(`${BOOKS_URL}/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: -10 });

    expect(response.status).toBe(400);
  });

  test('Should not allow updating immutable fields as id, ownerId', async () => {
    const { newRandomBook, token } = await createRandomBook();
    const validateBookId = createBookResponseSchema.parse(newRandomBook.body);
    const bookId = validateBookId.content.id;

    const response = await request(app)
      .patch(`${BOOKS_URL}/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ownerId: 'new-Owner-Id' });

    const validateErrorResponse = errorResponseSchema.parse(response.body);

    expect(response.status).toBe(400);
    expect(validateErrorResponse.message).toEqual('Validation failed');
    expect(validateErrorResponse.errors?.formErrors?.[0]).toBe('Unrecognized key: "ownerId"');
  });
});
