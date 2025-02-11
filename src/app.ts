import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler, rateLimiter, morgan } from './middlewares';
import router from './routes';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware Setup
// Morgan middleware for logging requests and error responses
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// Body parsing middleware
app.use(express.json()); // Middleware for parsing JSON request bodies

// CORS middleware to enable cross-origin requests
app.use(cors());

// Static file serving from 'public' folder
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'imgs', 'favicon.ico')));

// Rate limiter to prevent abuse and overload
app.use(rateLimiter);

// Security middleware to set HTTP headers (helmet)
app.use(helmet());

// Gzip compression to optimize response size
app.use(compression());

// Routes
app.use('/', router);

// Basic route for testing API accessibility
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Node Express TypeScript server!');
});

// Error Handling Middleware (catch and handle errors globally)
app.use(errorHandler);

export default app;
