const urlService = require('../services/urlService');

const createShortUrl = async (request, reply) => {
    const { longUrl, customSlug } = request.body;
    
    if (!longUrl) return reply.status(400).send({ error: 'URL is required' });

    try {
        let slugToUse = null;

        if (customSlug && customSlug.trim() !== "") {
            // Sanitize the slug (lowercase, no spaces, clean characters)
            slugToUse = customSlug
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-');

            // 1. Check if this slug already exists in the database
            const existingEntry = await urlService.getOriginalEntry(slugToUse); 
            
            if (existingEntry) {
                // 2. If it exists for the SAME URL, just return it without error
                if (existingEntry.long_url === longUrl) {
                    const host = request.headers.host;
                    return reply.status(200).send({
                        shortUrl: `http://${host}/${slugToUse}`,
                        originalUrl: longUrl,
                        message: "Existing link retrieved!"
                    });
                } else {
                    // 3. Conflict: Slug belongs to a different website
                    return reply.status(400).send({ error: 'This custom name is already taken!' });
                }
            }
        }

        // If it's a new slug or a random one, proceed with shortening
        const urlData = await urlService.shortenURL(longUrl, slugToUse);
        const host = request.headers.host;

        return reply.status(201).send({
            shortUrl: `http://${host}/${urlData.short_code}`,
            originalUrl: urlData.long_url
        });
    } catch (err) {
        console.error("Internal Logic Error:", err);
        return reply.status(500).send({ error: 'Internal Server Error' });
    }
};

const redirectToOriginal = async (request, reply) => {
    const { shortCode } = request.params;
    try {
        const longUrl = await urlService.getLongURL(shortCode);
        if (longUrl) {
            return reply.redirect(longUrl);
        }
        return reply.status(404).send({ error: 'URL not found' });
    } catch (err) {
        return reply.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createShortUrl,
    redirectToOriginal
};