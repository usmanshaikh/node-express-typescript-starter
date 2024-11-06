import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService, userService } from '../services';
import { catchAsync } from '../middlewares';
import { generateAuthTokens } from '../utils/jwt.utils';

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).send(user);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await generateAuthTokens(user.id);
  res.send({ user, tokens });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logoutUser(refreshToken);
  res.status(StatusCodes.NO_CONTENT).send();
});

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAuth(refreshToken);
  res.send(tokens);
});
