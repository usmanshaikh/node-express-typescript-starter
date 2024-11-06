import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken } from '../utils/jwt.utils';
import { Types } from 'mongoose';

// Extend the Request interface to add a `user` property
interface CustomRequest extends Request {
  user?: Types.ObjectId;
}

const authenticateJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void | Response => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header required' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const payload = verifyJwtToken(token);

  if (!payload || typeof payload.sub !== 'string') {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  req.user = new Types.ObjectId(payload.sub);
  next();
};

export default authenticateJWT;
