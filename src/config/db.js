const { Pool } = require('pg');
require('dotenv').config();

// The "Pool" manages multiple connections to the database automatically
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('PostgreSQL: Connected successfully');
});

pool.on('error', (err) => {
  console.error('PostgreSQL: Unexpected error', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};