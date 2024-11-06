export default class ApiError  extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates if it's an operational error
    Error.captureStackTrace(this, this.constructor);
  }
}