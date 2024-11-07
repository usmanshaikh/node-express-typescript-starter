import { StatusCodes } from 'http-status-codes';
import { User } from '../models';
import { ApiError } from '../helpers';
import { MESSAGES } from '../constants';

export const createUser = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, MESSAGES.EMAIL_ALREADY_TAKEN);
  }
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};

export const getUserById = async (id: string) => {
  const user = User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  }
  return user;
};

export const updateUserById = async (
  id: string,
  userData: {
    email?: string;
    password?: string;
    name?: string;
  },
) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  }

  if (userData.email) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, MESSAGES.EMAIL_ALREADY_TAKEN);
    }
  }

  Object.assign(user, userData);
  await user.save();
  return user;
};

export const deleteUserById = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  }
  return user;
};
