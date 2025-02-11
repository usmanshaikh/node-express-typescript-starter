import rateLimit from 'express-rate-limit';
import { MESSAGES } from '../constants';

const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute (60 seconds)
  max: 200, // Limit each IP to 200 requests per windowMs
  message: {
    status: 'error',
    statusCode: 429,
    message: MESSAGES.MAX_REQUESTS_REACHED,
  },
});

export default rateLimiter;
