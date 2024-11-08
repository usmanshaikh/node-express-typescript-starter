import mongoose from 'mongoose';
import connectDB from '../src/database';
import redisClient from '../src/config/redisClient';

beforeAll(async () => {
  await connectDB();
  await redisClient.connect()
});

afterAll(async () => {
  await mongoose.connection.close();
  redisClient.quit()
});
