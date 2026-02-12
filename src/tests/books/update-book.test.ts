import request from 'supertest';
import { createRandomBook } from './helper';
import { app } from '@ui/api';
import { signupAndLogin } from '../authentication/helpers';

describe('PATCH /books/:bookId', () => {
  const BOOKS_URL = '/books';
  test('Given no authorization header, endpoint should return 401 status code', async () => {
    const { newRandomBook } = await createRandomBook();
    const bookId = newRandomBook.body.content.id;

    const response = await request(app)
      .patch(`${BOOKS_URL}/${bookId}`)

      .send({ title: 'new-title' });

    expect(response.status).toBe(401);
  });

  test('Given an invalid token, endpoint should return a 401 status code', async () => {
    const { newRandomBook } = await createRandomBook();
    const bookId = newRandomBook.body.content.id;

    const response = await request(app)
      .patch(`${BOOKS_URL}/${bookId}`)
      .set('Authorization', `Bearer invalid-token`)
      .send({ title: 'new-title' });

    expect(response.status).toBe(401);
  });

  test('Given a non existing product, return a 404 status code', async () => {
    const { token, newRandomBook } = await createRandomBook();
    const bookId = newRandomBook.body.content.id;

    const response = await request(app)
      .patch(`${BOOKS_URL}/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(404);
  });

  test('Given an existing product, should return 200 and updated product', async () => {
    const { token, newRandomBook } = await createRandomBook();
    const bookId = newRandomBook.body.content.id;

    const updatedPayload = {
      title: 'Updated title',
      price: 150,
    };

    const response = await request(app)
      .patch(`${BOOKS_URL}/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPayload);

    expect(response.status).toBe(200);
    expect(response.body.content.title).toBe('Updated title');
    expect(response.body.content.price).toBe(150);
  });

  test('Given an user that is not the product owner, return a 403 status code', async () => {
    const { newRandomBook } = await createRandomBook();
    const bookId = newRandomBook.body.content.id;

    const tokenFromAnotherUser = await signupAndLogin('other-user@test.com', 'other-password');

    const response = await request(app)
      .patch(`${BOOKS_URL}/${bookId}`)
      .set('Authorization', `Bearer ${tokenFromAnotherUser}`)
      .send({ title: 'new-title' });

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({ message: 'Only the user can update this book' });
  });

  test('Given an invalid payload, should return a 400', async () => {
    const { newRandomBook, token } = await createRandomBook();
    const bookId = newRandomBook.body.content.id;

    const response = await request(app)
      .patch(`${BOOKS_URL}/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: -10 });

    expect(response.status).toBe(400);
  });

  test('Should not allow updating immutable fields as id, ownerId', async () => {
    const { newRandomBook, token } = await createRandomBook();
    const bookId = newRandomBook.body.content.id;

    const response = await request(app)
      .patch(`${BOOKS_URL}/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ownerId: 'new-Owner-Id' });

    expect(response.status).toBe(400);
  });
});
