import request from 'supertest';
import { faker } from '@faker-js/faker';

import { app } from '@ui/api';
import { type SigninResponse, signinResponseSchema } from '../schemas/test-schemas';

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

    const validateResponse: SigninResponse = signinResponseSchema.parse(response.body);
    expect(validateResponse.content).toBeDefined();
    expect(typeof validateResponse.content).toBe('string');
  });

  test('Should not expose sensitive user data', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    await request(app).post('/authentication/signup').send({ email, password });

    const response = await request(app).post(SIGNIN_URL).send({
      email,
      password,
    });

    const validateResponse = signinResponseSchema.parse(response.body);

    expect(validateResponse.content).toBeDefined();

    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('user');
    expect(response.body).not.toHaveProperty('hashedPassword');
    expect(response.body).not.toHaveProperty('_id');
  });
});
