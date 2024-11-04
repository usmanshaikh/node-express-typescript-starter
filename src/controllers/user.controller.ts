import { Request, Response } from 'express';
import { userService } from '../services';
import { catchAsync } from '../middlewares';

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = await userService.getUserById(id);
  return res.status(200).json({ user });
});
