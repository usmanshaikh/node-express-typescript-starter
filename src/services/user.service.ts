import { StatusCodes } from 'http-status-codes';
import { User } from '../models';
import { ApiError } from '../helpers';

export const getUserById = async (id: string) => {
  return { user: 'Usman Shaikh' };
};

export const createUser = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already taken');
  }
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};
