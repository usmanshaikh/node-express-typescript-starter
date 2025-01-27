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
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: MESSAGES.AUTH_HEADER_REQUIRED });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: MESSAGES.AUTH_TOKEN_REQ });
    return;
  }

  const payload = jwtHelper.verifyJwtToken(token);

  if (!payload || typeof payload.sub !== 'string') {
    res.status(403).json({ message: MESSAGES.INVALID_TOKEN });
    return;
  }

  req.user = new Types.ObjectId(payload.sub);
  next();
};

export default authenticateJWT;
