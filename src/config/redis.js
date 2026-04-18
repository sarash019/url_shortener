const Redis = require('ioredis');
require('dotenv').config();

// Connect to the Redis instance running in Docker
const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => {
  console.log('Redis: Connected successfully');
});

redis.on('error', (err) => {
  console.error('Redis: Connection error', err);
});

module.exports = redis;