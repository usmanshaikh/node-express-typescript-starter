import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../models';
import redisClient from '../config/redisClient';
import { ApiError, jwtHelper } from '../helpers';
import { MESSAGES } from '../constants';
import { userInterface } from '../interfaces';

export const loginUserWithEmailAndPassword = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, MESSAGES.INCORRECT_EMAIL_OR_PASSWORD);
  }
  return user;
};

export const logoutUser = async (refreshToken: string) => {
  // Blacklist the token by settinasdg it in Redis with a 'blacklisted' flag
  await redisClient.set(refreshToken, 'blacklisted', 'EX', 7 * 24 * 60 * 60); // same expiry as the token
};

export const refreshAuth = async (refreshToken: string) => {
  // Check if the refresh token is blacklisted
  const isBlacklisted = await redisClient.get(refreshToken);
  if (isBlacklisted === 'blacklisted') {
    throw new ApiError(StatusCodes.FORBIDDEN, MESSAGES.INVALID_REFRESH_TOKEN);
  }

  // Verify the refresh token
  const payload = jwtHelper.verifyJwtToken(refreshToken);
  if (!payload || !payload.sub) {
    throw new ApiError(StatusCodes.FORBIDDEN, MESSAGES.EXPIRED_REFRESH_TOKEN);
  }

  // Generate new access and refresh tokens
  const newTokens = await jwtHelper.generateAuthTokens(payload as userInterface.UserJwtDetails);

  // Blacklist the old refresh token
  // Set 1 day expiration
  await redisClient.set(refreshToken, 'blacklisted', 'EX', 24 * 60 * 60);

  // Save the new refresh token in Redis as valid
  // Set 7 days expiration
  await redisClient.set(newTokens.refresh.token, 'valid', 'EX', 7 * 24 * 60 * 60);

  return newTokens;
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const decoded = jwtHelper.verifyJwtToken(token) as JwtPayload & { type: string };

  // Check if the token is valid and of the correct type
  if (!decoded || decoded.type !== 'RESET_PASSWORD') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or expired token');
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < currentTimestamp) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Token has expired');
  }

  // Find the user by email (or ID, depending on the `sub` field in the token)
  const user = await User.findOne({ email: decoded.sub });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  user.password = newPassword; // The `pre` middleware will hash the password automatically

  await user.save();
};

export const verifyEmail = async (token: string): Promise<void> => {
  const decoded = jwtHelper.verifyJwtToken(token) as JwtPayload & { type: string };

  // Check if the token is valid and of the correct type
  if (!decoded || decoded.type !== 'VERIFY_EMAIL') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or expired token');
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < currentTimestamp) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Token has expired');
  }

  // Find the user by ID (or email, depending on the `sub` field in the token)
  const user = await User.findById(decoded.sub);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  user.isEmailVerified = true;

  await user.save();
};
