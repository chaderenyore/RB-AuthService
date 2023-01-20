const redis = require("redis");
// import { createClient } from 'redis';
const KEYS = require("./keys");
const logger = require("../../logger.conf");

logger.debug(KEYS.redisHost)
logger.debug(KEYS.redisPort)


