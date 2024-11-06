import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../helpers';

const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Set default status code and message
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  res.locals.errorMessage = err.message;

  // Send response to the client
  res.status(err.statusCode).json({
    status: 'error',
    // statusCode: err.statusCode,
    message: err.message,
  });
};

export default errorHandler;
