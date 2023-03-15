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
  WELCOME_MAIL_QUEUE: process.env.WELCOME_MAIL_QUEUE,
  PASSWORD_RESET_MAIL_QUEUE: process.env.PASSWORD_RESET_MAIL_QUEUE,
  ACCOUNT_VERIFICATION_MAIL_QUEUE: process.env.ACCOUNT_VERIFICATION_MAIL_QUEUE,
  USER_SERVICE_URI: process.env.USER_SERVICE_URI,
  BASE_URL: process.env.BASE_URL
};

module.exports = KEYS;
