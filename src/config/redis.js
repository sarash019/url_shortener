const Redis = require('ioredis');

// If REDIS_URL exists (Cloud), use it. Otherwise, use localhost settings.
const redis = new Redis(process.env.REDIS_URL || {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
});

redis.on('connect', () => {
    console.log('Redis: Connected successfully');
});

module.exports = redis;