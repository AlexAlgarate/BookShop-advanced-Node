import request from 'supertest';
import { faker } from '@faker-js/faker';

import { getTestApp } from '@tests/setup';
import { signupResponseSchema } from '@tests/schemas/test-schemas';
import { VALID_PASSWORD } from '@tests/helpers';

describe('POST /authentication/signup', () => {
  const AUTHENTICATION_URL = '/authentication/signup';
  test('Email is mandatory', async () => {
    const response = await request(getTestApp())
      .post(AUTHENTICATION_URL)
      .send({ password: VALID_PASSWORD });

    expect(response.status).toBe(400);
  });
  test('Password is mandatory', async () => {
    const response = await request(getTestApp())
      .post(AUTHENTICATION_URL)
      .send({ email: faker.internet.email() });

    expect(response.status).toBe(400);
  });

  test('Email should be unique', async () => {
    const email = faker.internet.email();

    const firstAttempResponse = await request(getTestApp()).post(AUTHENTICATION_URL).send({
      email,
      password: VALID_PASSWORD,
    });
    expect(firstAttempResponse.status).toBe(201);

    const secondAttempResponse = await request(getTestApp()).post(AUTHENTICATION_URL).send({
      email,
      password: VALID_PASSWORD,
    });
    expect(secondAttempResponse.status).toBe(409);
  });

  test('Should rejet invalid email format', async () => {
    const response = await request(getTestApp()).post(AUTHENTICATION_URL).send({
      email: 'not-an-email',
      password: VALID_PASSWORD,
    });

    expect(response.status).toBe(400);
  });

  test('Should reject short passwords', async () => {
    const response = await request(getTestApp()).post(AUTHENTICATION_URL).send({
      email: faker.internet.email(),
      password: '123',
    });

    expect(response.status).toBe(400);
  });

  test('Given a valid email and password, a new user is created', async () => {
    const email = faker.internet.email();
    const password = VALID_PASSWORD;

    const response = await request(getTestApp()).post(AUTHENTICATION_URL).send({
      email,
      password,
    });
    expect(response.status).toBe(201);
  });

  test('Should not return password in response body', async () => {
    const response = await request(getTestApp()).post(AUTHENTICATION_URL).send({
      email: faker.internet.email(),
      password: VALID_PASSWORD,
    });

    const validateResponse = signupResponseSchema.parse(response.body);

    expect(validateResponse.content).not.toHaveProperty('password');
    expect(validateResponse.content).toBe('User created successfully');
  });

  test('Should reject passwords without uppercase letters', async () => {
    const email = faker.internet.email();
    const invalidPassword = '123456789qwerqwer';

    const response = await request(getTestApp()).post(AUTHENTICATION_URL).send({
      email,
      password: invalidPassword,
    });

    expect(response.status).toBe(400);
  });

  test('Should reject passwords without lowercase letters', async () => {
    const email = faker.internet.email();
    const invalidPassword = '123456789QWERQWER';

    const response = await request(getTestApp()).post(AUTHENTICATION_URL).send({
      email,
      password: invalidPassword,
    });

    expect(response.status).toBe(400);
  });

  test('Should reject passwords without numbers', async () => {
    const email = faker.internet.email();
    const invalidPassword = 'QwerQwer';

    const response = await request(getTestApp()).post(AUTHENTICATION_URL).send({
      email,
      password: invalidPassword,
    });

    expect(response.status).toBe(400);
  });

  test('Should reject passwords longer than 16 characters', async () => {
    const email = faker.internet.email();
    const invalidPassword = '123456789123456789';

    const response = await request(getTestApp()).post(AUTHENTICATION_URL).send({
      email,
      password: invalidPassword,
    });

    expect(response.status).toBe(400);
  });
});
