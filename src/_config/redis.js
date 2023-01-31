const redis = require("redis");
// import { createClient } from 'redis';
const KEYS = require("./keys");
const logger = require("../../logger.conf");

logger.debug(KEYS.redisHost)
logger.debug(KEYS.redisPort)

  const redisClient = redis.createClient({
    host: KEYS.redisHost,
    port: KEYS.redisPort,
    no_ready_check: true,
    auth_pass: KEYS.redisPassword,
    legacyMode: true,
  });
  //  await redisClient.connect()
  redisClient.on("error", function (error) {
    logger.error(error);
  });



module.exports = redisClient;
