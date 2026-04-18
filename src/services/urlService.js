const db = require('../config/db');
const redis = require('../config/redis');
const { generateShortCode } = require('../utils/base62');

const shortenURL = async (longUrl, customSlug = null) => {
    // If customSlug is provided and not empty, use it. Otherwise generate random.
    const shortCode = (customSlug && customSlug.trim() !== "") ? customSlug : generateShortCode();

    // 1. Permanent Save to PostgreSQL
    const query = 'INSERT INTO urls (long_url, short_code) VALUES ($1, $2) RETURNING *';
    const result = await db.query(query, [longUrl, shortCode]);

    // 2. Cache Save to Redis
    await redis.set(shortCode, longUrl, 'EX', 86400);

    return result.rows[0];
};

const getLongURL = async (shortCode) => {
    // Check Cache first
    const cachedUrl = await redis.get(shortCode);
    if (cachedUrl) return cachedUrl;

    // Check DB
    const query = 'SELECT long_url FROM urls WHERE short_code = $1';
    const result = await db.query(query, [shortCode]);

    if (result.rows.length > 0) {
        const longUrl = result.rows[0].long_url;
        await redis.set(shortCode, longUrl, 'EX', 86400);
        return longUrl;
    }

    return null;
};

module.exports = { shortenURL, getLongURL };