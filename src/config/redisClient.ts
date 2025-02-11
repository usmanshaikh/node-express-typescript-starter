import Redis from 'ioredis';
import config from './config';

const redisClient = new Redis(`rediss://default:${config.redis.password}@${config.redis.host}:${config.redis.port}`);

export default redisClient;
