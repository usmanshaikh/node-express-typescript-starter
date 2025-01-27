import request from 'supertest';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import { User } from '../../src/models';
import app from '../../src/app';

const generateUser = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: 'password1',
});

describe('User Routes', () => {
  let accessToken: string;
  let userId: string;
  const dummyUser = generateUser();

  beforeAll(async () => {
    // Register the user
    const registerRes = await request(app).post('/auth/register').send(dummyUser);
    expect(registerRes.statusCode).toBe(StatusCodes.CREATED);

    // Login the user to get an access token and user ID
    const { name, ...loginPayload } = dummyUser;
    const loginRes = await request(app).post('/auth/login').send(loginPayload);
    const { user, tokens } = loginRes.body.data;

    accessToken = tokens.access.token;
    userId = user._id;

    expect(loginRes.statusCode).toBe(StatusCodes.OK);
  });

  describe('GET /:userId', () => {
    test('should fetch user details by ID with a valid token', async () => {
      const res = await request(app)
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.body.data).toMatchObject({
        _id: userId,
        email: dummyUser.email,
        name: dummyUser.name,
        isEmailVerified: false,
        failedLoginAttempts: expect.any(Number),
      });
    });

    test('should return 401 if no token is provided', async () => {
      const res = await request(app).get(`/users/${userId}`);
      expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });

    test('should return 403 if an invalid token is provided', async () => {
      const res = await request(app)
        .get(`/users/${userId}`)
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    });

  });

  afterAll(async () => {
    await User.deleteMany();
  });
});
