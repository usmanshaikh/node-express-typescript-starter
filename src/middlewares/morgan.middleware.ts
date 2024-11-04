import morgan from 'morgan';
import logger from '../utils/logger';

// Create a custom token for error messages
morgan.token('message', (req, res:any) => res.locals.errorMessage || '');

// Define response formats
const successResponseFormat = ':method :url :status - :response-time ms';
const errorResponseFormat = ':method :url :status - :response-time ms - message: :message';

// Success handler - log successful responses
export const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

// Error handler - log error responses with messages
export const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});