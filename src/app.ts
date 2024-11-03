import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Application routes
app.use('/', router);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Node Express TypeScript server!');
});

export default app;
