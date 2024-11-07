import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService, userService } from '../services';
import { catchAsync } from '../middlewares';
import { sendResponse, jwtHelper } from '../helpers';

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  sendResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: 'User successfully registered.',
    data: user,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await jwtHelper.generateAuthTokens(user.id);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: 'Login successful.',
    data: { user, tokens },
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logoutUser(refreshToken);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: 'Logout successful.',
  });
});

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAuth(refreshToken);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: 'Tokens refreshed successfully. New access and refresh tokens generated.',
    data: tokens,
  });
});
