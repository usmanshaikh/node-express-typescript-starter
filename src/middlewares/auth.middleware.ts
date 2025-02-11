import { Request, Response, NextFunction } from 'express';
import { jwtHelper } from '../helpers';
import { MESSAGES } from '../constants';

const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
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

  res.locals.user = payload;

  next();
};

export default authenticateJWT;
