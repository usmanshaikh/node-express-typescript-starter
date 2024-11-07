import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../services';
import { catchAsync } from '../middlewares';
import { sendResponse } from '../helpers';

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await userService.getUserById(userId);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: 'User data retrieved successfully.',
    data: user,
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await userService.updateUserById(userId, req.body);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: 'User data updated successfully.',
    data: user,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  await userService.deleteUserById(userId);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: 'User deleted successfully.',
  });
});
