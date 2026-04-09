import request from 'supertest';
import { faker } from '@faker-js/faker';

import { getTestApp } from '@tests/setup';
import { type SigninResponse, signinResponseSchema } from '@tests/schemas/test-schemas';
import { VALID_PASSWORD, API_SIGNIN_URL, API_SIGNUP_URL } from '@tests/helpers';

describe('POST /authentication/signin', () => {
  test('Should return 400 status code if email is missing', async () => {
    const response = await request(getTestApp())
      .post(API_SIGNIN_URL)
      .send({ password: VALID_PASSWORD });

    expect(response.status).toBe(400);
  });
  test('Should return 400 status code if password is missing', async () => {
    const response = await request(getTestApp())
      .post(API_SIGNIN_URL)
      .send({ email: faker.internet.email() });

    expect(response.status).toBe(400);
  });

  test('Should return 400 for invalid email format', async () => {
    const response = await request(getTestApp()).post(API_SIGNIN_URL).send({
      email: 'not-an-email',
      password: VALID_PASSWORD,
    });

    expect(response.status).toBe(400);
  });

  test('Should return 400 if the password is too short', async () => {
    const response = await request(getTestApp()).post(API_SIGNIN_URL).send({
      email: faker.internet.email(),
      password: '123',
    });

    expect(response.status).toBe(400);
  });

  test('Should return 404 if user not found', async () => {
    const response = await request(getTestApp())
      .post(API_SIGNIN_URL)
      .send({ email: faker.internet.email(), password: VALID_PASSWORD });

    expect(response.status).toBe(404);
  });

  test('Should return 401 if credentials are invalid', async () => {
    const email = faker.internet.email();
    const password = VALID_PASSWORD;

    await request(getTestApp()).post(API_SIGNUP_URL).send({ email, password });

    const response = await request(getTestApp())
      .post(API_SIGNIN_URL)
      .send({ email, password: 'WrongPassword123' });

    expect(response.status).toBe(401);
  });

  test('Should return token if credentials are valid', async () => {
    const email = faker.internet.email();
    const password = VALID_PASSWORD;

    await request(getTestApp()).post(API_SIGNUP_URL).send({ email, password });

    const response = await request(getTestApp()).post(API_SIGNIN_URL).send({
      email,
      password,
    });

    expect(response.status).toBe(200);

    const validateResponse: SigninResponse = signinResponseSchema.parse(response.body);
    expect(validateResponse.content).toBeDefined();
    expect(typeof validateResponse.content).toBe('string');
  });

  test('Should reject passwords without uppercase letters', async () => {
    const email = faker.internet.email();
    const invalidPassword = '123456789qwerqwer';

    const response = await request(getTestApp()).post(API_SIGNIN_URL).send({
      email,
      password: invalidPassword,
    });

    expect(response.status).toBe(400);
  });

  test('Should reject passwords without lowercase letters', async () => {
    const email = faker.internet.email();
    const invalidPassword = '123456789QWERQWER';

    const response = await request(getTestApp()).post(API_SIGNIN_URL).send({
      email,
      password: invalidPassword,
    });

    expect(response.status).toBe(400);
  });

  test('Should reject passwords without numbers', async () => {
    const email = faker.internet.email();
    const invalidPassword = 'QwerQwer';

    const response = await request(getTestApp()).post(API_SIGNIN_URL).send({
      email,
      password: invalidPassword,
    });

    expect(response.status).toBe(400);
  });

  test('Should reject passwords longer than 16 characters', async () => {
    const email = faker.internet.email();
    const invalidPassword = '123456789123456789';

    const response = await request(getTestApp()).post(API_SIGNIN_URL).send({
      email,
      password: invalidPassword,
    });

    expect(response.status).toBe(400);
  });
});
