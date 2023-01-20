const redisClient = require("../_config/redis");

exports.generateTokenAndStore = (key) => {
  const token = Math.floor(Math.random() * 99000) + 100000;
  redisClient.set(key, token, "EX", "1800", () => {});
  return token;
};


