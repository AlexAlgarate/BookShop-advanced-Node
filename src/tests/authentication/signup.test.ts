import request from 'supertest';
import { faker } from '@faker-js/faker';

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

  test('Given a valid email and password, a new user is created', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    const response = await request(app).post(AUTHENTICATION_URL).send({
      email,
      password,
    });
    expect(response.status).toBe(201);
  });
});
