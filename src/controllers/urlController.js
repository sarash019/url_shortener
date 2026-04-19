const createShortUrl = async (request, reply) => {
    const { longUrl, customSlug } = request.body;
    
    if (!longUrl) return reply.status(400).send({ error: 'URL is required' });

    try {
        let slugToUse = null;

        if (customSlug && customSlug.trim() !== "") {
            // Sanitize the slug
            slugToUse = customSlug
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-');

            // 1. Check if this slug already exists in the database
            const existingEntry = await urlService.getOriginalEntry(slugToUse); 
            
            if (existingEntry) {
                // 2. If it exists and the Long URL is the SAME, just return it!
                if (existingEntry.long_url === longUrl) {
                    const host = request.headers.host;
                    return reply.status(200).send({
                        shortUrl: `http://${host}/${slugToUse}`,
                        originalUrl: longUrl,
                        message: "Existing link retrieved!"
                    });
                } else {
                    // 3. If it exists but points to a DIFFERENT URL, show error
                    return reply.status(400).send({ error: 'This custom name is already taken by a different URL!' });
                }
            }
        }

        // If it's a new slug or a random one, proceed as usual
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