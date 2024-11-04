import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';
import { errorHandler } from './middlewares';
import { morgan } from './middlewares';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Morgan middleware for logging successful requests
app.use(morgan.successHandler);
// Morgan middleware for logging error responses
app.use(morgan.errorHandler);

// Middleware setup
app.use(cors()); // Enabling CORS
app.use(express.json()); // Middleware for parsing JSON request bodies

// Application routes
app.use('/', router);

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Node Express TypeScript server!');
});

// Error handling middleware
app.use(errorHandler);

export default app;