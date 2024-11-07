import rateLimit from 'express-rate-limit';
import { MESSAGES } from '../constants';

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    statusCode: 429,
    message: MESSAGES.MAX_REQUESTS_REACHED,
  },
});

export default rateLimiter;
