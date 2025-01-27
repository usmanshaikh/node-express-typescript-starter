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
  });

  describe('PATCH /:userId', () => {
    test('should update user details with a valid token', async () => {
      const updatedData = { name: 'Updated Name' };

      const res = await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedData);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.body.message).toBe('User updated successfully.');
      expect(res.body.data).toMatchObject({
        _id: userId,
        name: updatedData.name,
        email: dummyUser.email,
      });
    });

    test('should return 400 if invalid data is sent', async () => {
      const invalidData = { email: 'not-an-email' };

      const res = await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidData);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    test('should return 404 for a non-existent user ID', async () => {
      const nonExistentUserId = '64c999999aa9f1234567890b';
      const res = await request(app)
        .patch(`/users/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'New Name' });

      expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE /:userId', () => {
    test('should delete the user with a valid token', async () => {
      const res = await request(app)
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.body.message).toBe('User deleted successfully.');

      // Verify the user is deleted
      const user = await User.findById(userId);
      expect(user).toBeNull();
    });

    test('should return 404 for a non-existent user ID', async () => {
      const nonExistentUserId = '64c999999aa9f1234567890b';
      const res = await request(app)
        .delete(`/users/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    test('should return 401 if no token is provided', async () => {
      const res = await request(app).delete(`/users/${userId}`);
      expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await User.deleteMany();
  });
});
