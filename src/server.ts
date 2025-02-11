import { Server } from 'http';
import app from './app';
import config from './config/config';
import logger from './config/logger';
import connectDB from './database';
import mongoose from 'mongoose';
import redisClient from './config/redisClient';

let server: Server;

// Graceful shutdown timeout
const shutdownTimeout = 30000; // Timeout set to 30 seconds for shutdown

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Closing the server...`);
  if (server) {
    server.close(() => {
      logger.info('Server closed successfully');
      redisClient.quit(); // Close the Redis connection
      process.exit(0); // Graceful shutdown
    });

    setTimeout(() => {
      logger.error('Forcing server shutdown due to timeout');
      process.exit(1); // Forcefully exit after the timeout
    }, shutdownTimeout);
  } else {
    process.exit(1); // If the server wasn't started, force exit
  }
};

// Connect to MongoDB and Redis, then start the server
const initializeServer = async () => {
  try {
    await connectDB();
    logger.info('Connected to MongoDB');

    if (!redisClient.status || redisClient.status !== 'ready') {
      await redisClient.connect();
    }
    logger.info('Connected to Redis');

    server = app.listen(config.port, () => {
      logger.info(`Server is running on http://localhost:${config.port}`);
    });
  } catch (error) {
    logger.error('Error during initialization:', error);
    process.exit(1);
  }
};

initializeServer();

// Uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught exception:', error);
  gracefulShutdown('UncaughtException');
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UnhandledRejection');
});

// Handle termination signals (SIGTERM, SIGINT)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', async () => {
  logger.info('SIGINT received. Closing MongoDB connection...');
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
  gracefulShutdown('SIGINT');
});
