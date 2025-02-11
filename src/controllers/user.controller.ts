import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../services';
import { catchAsync } from '../middlewares';
import { sendResponse } from '../helpers';
import { MESSAGES } from '../constants';

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const userId = res.locals.user.userId;
  const user = await userService.getUserById(userId);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: MESSAGES.USER_DATA_RETRIEVED,
    data: user,
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = res.locals.user.userId;
  const user = await userService.updateUserById(userId, req.body);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: MESSAGES.USER_UPDATED,
    data: user,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = res.locals.user.userId;
  await userService.deleteUserById(userId);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: MESSAGES.USER_DELETED,
  });
});
