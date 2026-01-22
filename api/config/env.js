const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  apiPort: Number(process.env.API_PORT || process.env.PORT || 3001),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'radio_user',
    password: process.env.DB_PASSWORD || 'agakiza',
    database: process.env.DB_NAME || 'radio_agakiza',
    connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
};
