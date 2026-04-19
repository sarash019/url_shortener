const urlController = require('../controllers/urlController');

async function urlRoutes(fastify, options) {
    // Connects the POST /shorten path to the controller function
    fastify.post('/shorten', urlController.createShortUrl);
    
    // Handles the redirects via the shortCode parameter
    fastify.get('/:shortCode', urlController.redirectToOriginal);
}

module.exports = urlRoutes;