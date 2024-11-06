import { StatusCodes } from 'http-status-codes';
import { User } from '../models';
import redisClient from '../config/redisClient';
import { ApiError, jwtHelper } from '../helpers';

export const loginUserWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

export const logoutUser = async (refreshToken: string) => {
  // Blacklist the token by setting it in Redis with a 'blacklisted' flag
  await redisClient.set(refreshToken, 'blacklisted', { EX: 7 * 24 * 60 * 60 }); // same expiry as the token
};

export const refreshAuth = async (refreshToken: string) => {
  // Check if the refresh token is blacklisted
  const isBlacklisted = await redisClient.get(refreshToken);
  if (isBlacklisted === 'blacklisted') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Refresh token is invalid');
  }

  // Verify the refresh token
  const payload = jwtHelper.verifyJwtToken(refreshToken);
  if (!payload || !payload.sub) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid or expired refresh token');
  }

  // Generate new access and refresh tokens
  const newTokens = await jwtHelper.generateAuthTokens(payload.sub);

  // Blacklist the old refresh token
  await redisClient.set(refreshToken, 'blacklisted', {
    EX: 24 * 60 * 60, // Set 1 day expiration
  });

  // Save the new refresh token in Redis as valid
  await redisClient.set(newTokens.refresh.token, 'valid', {
    EX: 7 * 24 * 60 * 60, // Set 7 days expiration
  });

  return newTokens;
};
