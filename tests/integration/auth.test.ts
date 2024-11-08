import request from 'supertest';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../../src/constants';
import { User } from '../../src/models';
import app from '../../src/app';

const generateUser = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: 'password1',
});

describe('Auth Routes', () => {
  const dummyUser = generateUser();
  describe('POST /auth/register', () => {
    test(`should return ${StatusCodes.CREATED} and successfully register user if request data is ok`, async () => {
      const res = await request(app).post('/auth/register').send(dummyUser);
      const { password, ...expectedUserData } = dummyUser;
      expect(res.statusCode).toBe(StatusCodes.CREATED);
      expect(res.body.data).toMatchObject({
        ...expectedUserData,
        _id: expect.any(String),
        isEmailVerified: false,
        failedLoginAttempts: 0,
      });
    });

    test(`should return ${StatusCodes.BAD_REQUEST} error if email is already used`, async () => {
      const res = await request(app).post('/auth/register').send(dummyUser);
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.message).toBe(MESSAGES.EMAIL_ALREADY_TAKEN);
    });
  });
  describe('POST /auth/login', () => {
    const { name, ...payload } = dummyUser;
    test(`should return ${StatusCodes.OK} and successfully Login`, async () => {
      const res = await request(app).post('/auth/login').send(payload);
      const { message, data } = res.body;
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(message).toBe(MESSAGES.LOGIN_SUCCESS);
      expect(data).toMatchObject({
        user: {
          _id: expect.any(String),
          email: payload.email,
          name: name,
          isEmailVerified: expect.any(Boolean),
          failedLoginAttempts: expect.any(Number),
        },
        tokens: {
          access: { token: expect.any(String), expires: expect.any(String) },
          refresh: { token: expect.any(String), expires: expect.any(String) },
        },
      });
    });
  });
  afterAll(async () => {
    await User.deleteMany();
  });
});
