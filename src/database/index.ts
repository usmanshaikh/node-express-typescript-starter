import mongoose from 'mongoose';
import config from '../config/config';
import logger from '../config/logger';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoose.url);
  } catch (err) {
    logger.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
};

export default connectDB;
