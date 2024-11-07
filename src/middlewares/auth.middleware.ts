import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { jwtHelper } from '../helpers';
import { MESSAGES } from '../constants';

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
    return res.status(401).json({ message: MESSAGES.AUTH_HEADER_REQUIRED });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: MESSAGES.AUTH_TOKEN_REQ });
  }

  const payload = jwtHelper.verifyJwtToken(token);

  if (!payload || typeof payload.sub !== 'string') {
    return res.status(403).json({ message: MESSAGES.INVALID_TOKEN });
  }

  req.user = new Types.ObjectId(payload.sub);
  next();
};

export default authenticateJWT;
