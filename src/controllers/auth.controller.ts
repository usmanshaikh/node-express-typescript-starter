import { Request, Response } from 'express';
import { authService } from '../services';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.authenticateUser(email, password);
    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
