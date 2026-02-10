import request from 'supertest';
import { faker } from '@faker-js/faker';

import { app } from '@ui/api';

describe('POST /authentication/signin', () => {
  const SIGNIN_URL = '/authentication/signin';

  test('Should return 400 status code if email and password is missing', async () => {
    const response = await request(app).post(SIGNIN_URL).send({});

    expect(response.status).toBe(400);
  });

  test('Should return 400 for invalid email format', async () => {
    const response = await request(app).post(SIGNIN_URL).send({
      email: 'not-an-email',
      password: faker.internet.password(),
    });

    expect(response.status).toBe(400);
  });

  test('Should return 400 if the password is too short', async () => {
    const response = await request(app).post(SIGNIN_URL).send({
      email: faker.internet.email(),
      password: '123',
    });

    expect(response.status).toBe(400);
  });

  test('Should return 400 if an empty password is given', async () => {
    const response = await request(app).post(SIGNIN_URL).send({
      email: faker.internet.email(),
      password: '',
    });

    expect(response.status).toBe(400);
  });

  test('Should return 404 if user not found', async () => {
    const response = await request(app)
      .post(SIGNIN_URL)
      .send({ email: faker.internet.email(), password: faker.internet.password() });

    expect(response.status).toBe(404);
  });

  test('Should return 401 if credentials are invalid', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    await request(app).post('/authentication/signup').send({ email, password });

    const response = await request(app)
      .post(SIGNIN_URL)
      .send({ email, password: 'wrong-password' });

    expect(response.status).toBe(401);
  });

  test('Should return token if credentials are valid', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    await request(app).post('/authentication/signup').send({ email, password });

    const response = await request(app).post(SIGNIN_URL).send({
      email,
      password,
    });
    expect(response.status).toBe(200);
    expect(response.body.content).toBeDefined();
    expect(typeof response.body.content.token).toBe('string');
  });

  test('Should not expose sensitive user data', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    await request(app).post('/authentication/signup').send({ email, password });

    const response = await request(app).post(SIGNIN_URL).send({
      email,
      password,
    });

    expect(response.body.password).toBeUndefined();
    expect(response.body.user).toBeUndefined();
  });
});
