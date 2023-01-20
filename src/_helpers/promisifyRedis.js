const { promisify } = require("util");
const redisClient = require("../_config/redis");

exports.redisGetAsync = promisify(redisClient.get).bind(redisClient);