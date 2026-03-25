import { vi } from 'vitest';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

import { getTestApp } from '@tests/setup';
import { signupResponseSchema } from '@tests/schemas/test-schemas';

describe('POST /authentication/signup', () => {
  const AUTHENTICATION_URL = '/authentication/signup';
  const VALID_PASSWORD = 'Qwertyui1.';
  test('Email and password should be mandatory', async () => {
    const response = await request(getTestApp()).post(AUTHENTICATION_URL).send({});

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

  test('Should reject empty password', async () => {
    const response = await request(getTestApp()).post(AUTHENTICATION_URL).send({
      email: faker.internet.email(),
      password: '',
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

  test('Password should be hashed before storing', async () => {
    const originalHash = bcrypt.hash;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const hashSpy = vi.spyOn(bcrypt, 'hash').mockImplementation(originalHash);

    await request(getTestApp()).post(AUTHENTICATION_URL).send({
      email: faker.internet.email(),
      password: VALID_PASSWORD,
    });

    expect(hashSpy).toHaveBeenCalled();
    hashSpy.mockRestore();
  });
});
