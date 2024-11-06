import { createClient } from 'redis';
import config from './config';

const redisClient = createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`,
});

export default redisClient;

// Install Redis on Windows
// https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-windows/
// How to install Linux on Windows with WSL
// https://learn.microsoft.com/en-us/windows/wsl/install

// > wsl -d Ubuntu
// > sudo service redis-server start
// > redis-cli
// > ping
