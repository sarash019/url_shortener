const urlController = require('../controllers/urlController');

async function urlRoutes(fastify, options) {
    // Path to create a short URL
    fastify.post('/shorten', urlController.createShortUrl);

    // Path to redirect from a short code
    fastify.get('/:shortCode', urlController.redirectToUrl);
}

module.exports = urlRoutes;