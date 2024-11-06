import { AppError } from '../utils/AppError';

export const getUserById = async (id: string) => {
  // throw new AppError('User not found', 404);
  return { user: 'Usman Shaikh' };
};

export const createUser = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  return { user: 'Usman Shaikh' };
};
