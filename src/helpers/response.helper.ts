import { Response } from 'express';

interface ResponseOptions {
  res: Response;
  statusCode: number;
  message?: string;
  data?: any;
}

export const sendResponse = ({ res, statusCode, message = 'Success', data }: ResponseOptions) => {
  const response: any = {
    status: statusCode >= 400 ? 'error' : 'success',
    message,
    ...(data != null && { data }), // Only include 'data' if it's not null or undefined
  };
  res.status(statusCode).json(response);
};
