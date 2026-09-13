require('dotenv').config();
let db;

// Basic DB factory pattern
if (process.env.DB_TYPE === 'firebase') {
    db = require('./lib/db/firebaseAdapter');
} else if (process.env.DB_TYPE === 'postgres') {
    db = require('./lib/db/postgresAdapter');
} else if (process.env.DB_TYPE === 'mysql') {
    db = require('./lib/db/mysqlAdapter');
} else if (process.env.DB_TYPE === 'mongo') {
    db = require('./lib/db/mongoAdapter');
} else if (process.env.DB_TYPE === 'supabase') {
    db = require('./lib/db/supabaseAdapter');
} else if (process.env.DB_TYPE === 'redis') {
    db = require('./lib/db/redisAdapter');
} else {
    db = require('./lib/db/sqliteAdapter');
}

module.exports = db;