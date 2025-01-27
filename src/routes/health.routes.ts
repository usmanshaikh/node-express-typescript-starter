import { Router, Request, Response } from 'express';
import redisClient from '../config/redisClient';
import mongoose from 'mongoose';

const router = Router();

// Health Check Route
router.get('/health-check', async (req: Request, res: Response) => {
  try {
    await redisClient.ping();
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
    } else {
      throw new Error('MongoDB is not connected');
    }
    res.status(200).send('Service is healthy');
  } catch (error) {
    res.status(500).send('Service is down');
  }
});

// Test Redis connection
router.get('/redis-test', async (req: Request, res: Response) => {
  try {
    await redisClient.set('test', 'Redis is connected!');
    const value = await redisClient.get('test');
    res.send(value);
  } catch (err) {
    res.status(500).send('Error with Redis');
  }
});

export default router;
