import { createClient } from 'redis';
import config from './config';

const redisClient = createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`,
});

// redisClient.on('connect', () => console.log('Cache is connecting'));
// redisClient.on('ready', () => console.log('Cache is ready'));
// redisClient.on('end', () => console.log('Cache disconnected'));
// redisClient.on('reconnecting', () => console.log('Cache is reconnecting'));
// redisClient.on('error', (e) => console.log(e));

export default redisClient;