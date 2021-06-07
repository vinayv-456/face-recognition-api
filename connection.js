const Pg = require('pg')

const pool = new Pg.Pool({
  // user: 'postgres',
  // host: '127.0.0.1',
  // database: 'fr',
  // password: 'password',
  // port: 5432,
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

exports.pool = pool;
