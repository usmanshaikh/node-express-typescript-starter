import { Response } from 'express';

interface ResponseOptions {
  res: Response;
  statusCode: number;
  message: string;
  data?: any;
}

export const sendResponse = ({
  res,
  statusCode,
  message,
  data = null,
}: ResponseOptions) => {
  res.status(statusCode).json({
    status: statusCode >= 400 ? 'error' : 'success',
    message,
    data,
  });
};
