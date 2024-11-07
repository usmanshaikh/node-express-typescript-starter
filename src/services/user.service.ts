import { StatusCodes } from 'http-status-codes';
import { User } from '../models';
import { ApiError } from '../helpers';

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

export const getUserById = async (id: string) => {
  const user = User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
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
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (userData.email) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already taken');
    }
  }

  Object.assign(user, userData);
  await user.save();
  return user;
};

export const deleteUserById = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  return user;
};
