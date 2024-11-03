import { Request, Response } from 'express';
import { userService } from '../services';

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user } = await userService.getUserById(id);
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
