import { describe, jest } from '@jest/globals';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

import { app } from '@ui/api';

describe('POST /authentication/signup', () => {
  const AUTHENTICATION_URL = '/authentication/signup';

  test('Email and password should be mandatory', async () => {
    const response = await request(app).post(AUTHENTICATION_URL).send({});

    expect(response.status).toBe(400);
  });

  test('Email should be unique', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    const firstAttempResponse = await request(app).post(AUTHENTICATION_URL).send({
      email,
      password,
    });
    expect(firstAttempResponse.status).toBe(201);

    const secondAttempResponse = await request(app).post(AUTHENTICATION_URL).send({
      email,
      password,
    });
    expect(secondAttempResponse.status).toBe(409);
  });

  test('Should rejet invalid email format', async () => {
    const response = await request(app).post(AUTHENTICATION_URL).send({
      email: 'not-an-email',
      password: faker.internet.password(),
    });

    expect(response.status).toBe(400);
  });

  test('Should reject short passwords', async () => {
    const response = await request(app).post(AUTHENTICATION_URL).send({
      email: faker.internet.email(),
      password: '123',
    });

    expect(response.status).toBe(400);
  });

  test('Should reject empty password', async () => {
    const response = await request(app).post(AUTHENTICATION_URL).send({
      email: faker.internet.email(),
      password: '',
    });

    expect(response.status).toBe(400);
  });

  test('Given a valid email and password, a new user is created', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    const response = await request(app).post(AUTHENTICATION_URL).send({
      email,
      password,
    });
    expect(response.status).toBe(201);
  });

  test('Should not return password in response body', async () => {
    const response = await request(app).post(AUTHENTICATION_URL).send({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(response.body.password).toBeUndefined();
  });

  test('Password should be hashed before storing', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await request(app).post(AUTHENTICATION_URL).send({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(hashSpy).toHaveBeenCalled();
  });
});
