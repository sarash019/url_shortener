const urlService = require('../services/urlService');

const createShortUrl = async (request, reply) => {
    const { longUrl, customSlug } = request.body;
    
    if (!longUrl) return reply.status(400).send({ error: 'URL is required' });

    try {
        let slugToUse = null;

        if (customSlug && customSlug.trim() !== "") {
            // THE POLISH: Sanitize the slug
            slugToUse = customSlug
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with hyphens
                .replace(/[^a-z0-9-]/g, '')     // Remove anything not a-z, 0-9, or -
                .replace(/-+/g, '-');           // Remove double hyphens (-- to -)

            // Validation: Make sure it's not too short after cleaning
            if (slugToUse.length < 2) {
                return reply.status(400).send({ error: 'Custom name must be at least 2 characters long.' });
            }

            // Check if this cleaned slug is already taken
            const existingUrl = await urlService.getLongURL(slugToUse);
            if (existingUrl) {
                return reply.status(400).send({ error: 'This custom name is already taken!' });
            }
        }

        const urlData = await urlService.shortenURL(longUrl, slugToUse);
        const host = request.headers.host;

        return reply.status(201).send({
            shortUrl: `http://${host}/${urlData.short_code}`,
            originalUrl: urlData.long_url
        });
    } catch (err) {
        console.error("ERROR:", err);
        return reply.status(500).send({ error: 'Internal Server Error' });
    }
};

const redirectToUrl = async (request, reply) => {
    const { shortCode } = request.params;
    if (!shortCode || shortCode === 'favicon.ico') return;

    try {
        const longUrl = await urlService.getLongURL(shortCode);
        if (longUrl) {
            return reply.redirect(longUrl);
        } else {
            return reply.status(404).send({ error: 'URL not found' });
        }
    } catch (err) {
        return reply.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = { createShortUrl, redirectToUrl };