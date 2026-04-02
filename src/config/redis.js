const { createClient } = require("redis");
const logger = require("../utils/logger");

console.log("Loaded REDIS_URL:", process.env.REDIS_URL);
const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("error", (error) => {
  logger.error("Redis client error", {
    error: error.message,
    stack: error.stack
  });
});

redisClient.on("connect", () => {
  logger.info("Redis client connected");
});

module.exports = redisClient;