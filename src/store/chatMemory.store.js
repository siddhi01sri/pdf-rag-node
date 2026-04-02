const redisClient = require("../config/redis");
const logger = require("../utils/logger");

const getSessionKey = (sessionId) => `chat:${sessionId}`;

const getSessionHistory = async (sessionId) => {
  try {
    const key = getSessionKey(sessionId);
    const history = await redisClient.get(key);

    return history ? JSON.parse(history) : [];
  } catch (error) {
    logger.error("Failed to get session history from Redis", {
      error: error.message,
      sessionId
    });
    throw error;
  }
};

const addMessageToSession = async (sessionId, message) => {
  try {
    const key = getSessionKey(sessionId);
    const existingHistory = await getSessionHistory(sessionId);
    const updatedHistory = [...existingHistory, message];

    await redisClient.set(
      key,
      JSON.stringify(updatedHistory),
      {
        EX: Number(process.env.CHAT_SESSION_TTL || 86400)
      }
    );
  } catch (error) {
    logger.error("Failed to add session history to Redis", {
      error: error.message,
      sessionId
    });
    throw error;
  }
};

const clearSessionHistory = async (sessionId) => {
  try {
    const key = getSessionKey(sessionId);
    await redisClient.del(key);
  } catch (error) {
    logger.error("Failed to clear session history from Redis", {
      error: error.message,
      sessionId
    });
    throw error;
  }
};

module.exports = {
  getSessionHistory,
  addMessageToSession,
  clearSessionHistory
};