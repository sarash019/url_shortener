require('dotenv').config();
const path = require('path');
const fs = require('fs');
const fastify = require('fastify')({ 
    logger: true // Keeps logs so you can see what's happening in the cloud
});
const fastifyStatic = require('@fastify/static');
const db = require('./config/db');
const redis = require('./config/redis');
const urlRoutes = require('./routes/urlRoutes');

// 1. Static File Support
fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), 'public'),
    prefix: '/public/', 
});

// 2. The Main Website Route
fastify.get('/', async (request, reply) => {
    const htmlPath = path.join(process.cwd(), 'public', 'index.html');
    
    if (fs.existsSync(htmlPath)) {
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        return reply.type('text/html').send(htmlContent);
    } else {
        return reply.status(404).send("Error: index.html not found. Check your folder structure!");
    }
});

// 3. Register your API Routes (Shorten & Redirect)
fastify.register(urlRoutes);

// 4. Health Check (Very important for Cloud providers to see if your app is "Alive")
fastify.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

// 5. THE START FUNCTION (This is where the server actually turns on)
const start = async () => {
    try {
        // process.env.PORT is provided by Railway/Render
        // If it doesn't exist (like on your laptop), it defaults to 3000
        const port = process.env.PORT || 3000;
        
        await fastify.listen({ 
            port: port, 
            host: '0.0.0.0' // Required for cloud deployment
        });

        console.log(`🚀 BuyHatke Shortener is live at http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

// Execute the start function
start();