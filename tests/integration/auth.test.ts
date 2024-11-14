import request from 'supertest';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../../src/constants';
import { User } from '../../src/models';
import app from '../../src/app';
import redisClient from '../../src/config/redisClient';

// Helper function to generate dummy user data
const generateUser = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: 'password1',
});

describe('Auth Routes', () => {
  let refreshToken: string;
  const dummyUser = generateUser();

  describe('POST /auth/register', () => {
    test('should register a user successfully and return a 201 status code', async () => {
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

    test('should return a 400 status code if email is already used', async () => {
      const res = await request(app).post('/auth/register').send(dummyUser);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.message).toBe(MESSAGES.EMAIL_ALREADY_TAKEN);
    });
  });

  describe('POST /auth/login', () => {
    const { name, ...payload } = dummyUser;

    test('should login a user successfully and return a 200 status code with tokens', async () => {
      const res = await request(app).post('/auth/login').send(payload);
      const { message, data } = res.body;
      refreshToken = data.tokens.refresh.token;

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

      // Delay to allow different 'iat' timestamps in tokens
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });
  });

  describe('POST /auth/refresh-tokens', () => {
    test('should refresh tokens successfully and return a 200 status code', async () => {
      const res = await request(app)
        .post('/auth/refresh-tokens')
        .send({ refreshToken });
      const { message } = res.body;
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(message).toBe(MESSAGES.TOKENS_REFRESHED_SUCCESS);
    });

    test('should return a 403 status code when trying to use a blacklisted refresh token', async () => {
      const res = await request(app)
        .post('/auth/refresh-tokens')
        .send({ refreshToken });

      console.log('Token state in Redis when blacklisted:', await redisClient.get(refreshToken));

      const { message } = res.body;
      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(message).toBe(MESSAGES.INVALID_REFRESH_TOKEN);
    });
  });

  afterAll(async () => {
    await User.deleteMany(); // Clean up users after tests
  });
});
