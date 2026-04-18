const { nanoid } = require('nanoid');

/**
 * Generates a unique 6-character short code using 
 * the nanoid library.
 */
const generateShortCode = () => {
    // 6 characters provides billions of unique combinations
    return nanoid(6); 
};

module.exports = { generateShortCode };