const db = require('../config/db');
const redis = require('../config/redis');
const { encode } = require('../utils/base62');

/**
 * Generates a random short code using Base62
 */
const generateShortCode = () => {
    // Generates a random number between 100 million and 999 million
    const seed = Math.floor(Math.random() * 900000000) + 100000000;
    return encode(seed);
};

/**
 * Main function to shorten a URL
 * Handles both auto-generated and custom slugs
 */
const shortenURL = async (longUrl, customSlug = null) => {
    // Use customSlug if provided, otherwise generate a random one
    const shortCode = (customSlug && customSlug.trim() !== "") ? customSlug : generateShortCode();

    // 1. Permanent Save to PostgreSQL
    const query = 'INSERT INTO urls (long_url, short_code) VALUES ($1, $2) RETURNING *';
    const result = await db.query(query, [longUrl, shortCode]);

    // 2. Cache Save to Redis (Expires in 24 hours)
    await redis.set(shortCode, longUrl, 'EX', 86400);

    return result.rows[0];
};

/**
 * Retrieves the long URL from Redis (Fast) or Postgres (Fallback)
 */
const getLongURL = async (shortCode) => {
    // 1. Check Redis Cache first
    const cachedUrl = await redis.get(shortCode);
    if (cachedUrl) {
        console.log('Redis Cache Hit!');
        return cachedUrl;
    }

    // 2. Fallback to PostgreSQL
    console.log('Redis Cache Miss. Checking Postgres...');
    const query = 'SELECT long_url FROM urls WHERE short_code = $1';
    const result = await db.query(query, [shortCode]);

    if (result.rows.length > 0) {
        const longUrl = result.rows[0].long_url;
        // Re-populate Redis cache for next time
        await redis.set(shortCode, longUrl, 'EX', 86400);
        return longUrl;
    }

    return null;
};

/**
 * NEW: Retrieves the full database entry for a short code.
 * This is used to check if a custom slug already points to the same URL.
 */
const getOriginalEntry = async (shortCode) => {
    const query = 'SELECT * FROM urls WHERE short_code = $1';
    const result = await db.query(query, [shortCode]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

module.exports = {
    shortenURL,
    getLongURL,
    getOriginalEntry,
    generateShortCode
};