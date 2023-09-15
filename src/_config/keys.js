const dotenv = require("dotenv");
dotenv.config();

const KEYS = {
  mongoURI: process.env.MONGODBURI,
  JWTSecret: process.env.JWTSECRET,
  expiresIn: process.env.EXPIRES_IN,
  redisHost: process.env.REDISHOST,
  redisPort: process.env.REDISPORT,
  redisPassword: process.env.REDISPASSWORD,
  appVersion: process.env.APP_VERSION,
  NOTIFICATION_URI: process.env.NOTIFICATION_URI,
  ADMIN_SERVICE_URI: process.env.ADMIN_SERVICE_URI,
  AMQP_URI:process.env.AMQP_URI,
  BLOCK_UNBLOCK_USER_QUEUE: process.env.BLOCK_UNBLOCK_USER_QUEUE,
  VERIFY_USER_QUEUE: process.env.VERIFY_USER_QUEUE,
  USER_SERVICE_URI: process.env.USER_SERVICE_URI,
  BASE_URL: process.env.BASE_URL,
  SENDFOX_APIKEY: process.env.SENDFOX_APIKEY
};

module.exports = KEYS;
