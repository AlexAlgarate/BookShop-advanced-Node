import request from 'supertest';
import { createRandomBook } from './helper';
import { app } from '@ui/api';
import { faker } from '@faker-js/faker';
import { signupAndLogin } from '../authentication/helpers';
// import { faker } from '@faker-js/faker';

describe('POST /books/:bookId/buy', () => {
  test('Should return 401 if user is not authenticated', async () => {
    const { newRandomBook } = await createRandomBook();
    const bookId = newRandomBook.body.content.id;
    const response = await request(app).post(`/books/${bookId}/buy`);

    expect(response.status).toBe(401);
  });

  test('Should return 404 if book does not exist', async () => {
    const { token } = await createRandomBook();
    const fakeBookId = '698f869c9d81e007ef244f4e';

    const response = await request(app)
      .post(`/books/${fakeBookId}/buy`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toContain(`Book with id ${fakeBookId} could not be found`);
  });

  test('Should return 403 if user tries to buy theis own books', async () => {
    const email = faker.internet.email();
    const { newRandomBook, token } = await createRandomBook(email);
    const bookId = newRandomBook.body.content.id;

    const response = await request(app)
      .post(`/books/${bookId}/buy`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('You cannot buy your own book');
  });

  test('The book is successfully buyed', async () => {
    const sellerEmail = faker.internet.email();
    const { newRandomBook } = await createRandomBook(sellerEmail);
    const bookId = newRandomBook.body.content.id;

    const buyerEmail = faker.internet.email();
    const buyerToken = await signupAndLogin(buyerEmail);

    const response = await request(app)
      .post(`/books/${bookId}/buy`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(response.status).toBe(200);
    expect(response.body.content.status).toBe('SOLD');
    expect(response.body.content.soldAt).toBeDefined();
    expect(response.body.content.soldAt).not.toBeNull();
    expect(new Date(response.body.content.soldAt)).toBeInstanceOf(Date);
  });

  test('Should return 409 if book is already sold', async () => {
    const sellerEmail = faker.internet.email();
    const { newRandomBook } = await createRandomBook(sellerEmail);
    const bookId = newRandomBook.body.content.id;

    const firstBuyerEmail = faker.internet.email();
    const firstBuyerToken = await signupAndLogin(firstBuyerEmail);
    await request(app)
      .post(`/books/${bookId}/buy`)
      .set('Authorization', `Bearer ${firstBuyerToken}`);

    const secondBuyerEmail = faker.internet.email();
    const secondBuyerToken = await signupAndLogin(secondBuyerEmail);
    const response = await request(app)
      .post(`/books/${bookId}/buy`)
      .set('Authorization', `Bearer ${secondBuyerToken}`);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Book is not available for purchase');
  });

  test('Should update book status from PUBLISHED to SOLD', async () => {
    const sellerEmail = faker.internet.email();
    const { newRandomBook } = await createRandomBook(sellerEmail);
    const bookId = newRandomBook.body.content.id;

    expect(newRandomBook.body.content.status).toBe('PUBLISHED');
    expect(newRandomBook.body.content.soldAt).toBeNull();

    const buyerEmail = faker.internet.email();
    const buyerToken = await signupAndLogin(buyerEmail);

    const response = await request(app)
      .post(`/books/${bookId}/buy`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(response.status).toBe(200);
    expect(response.body.content.status).toBe('SOLD');
    expect(response.body.content.soldAt).toBeDefined();
  });
});
