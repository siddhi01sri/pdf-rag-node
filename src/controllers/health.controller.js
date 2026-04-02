const pool = require("../config/db");
const logger = require("../utils/logger");

const getHealth = async (req, res) => {
  try {
    const dbResult = await pool.query("select now() as current_time");

    logger.debug("Health check passed", {
      environment: process.env.NODE_ENV || "development"
    });

    return res.status(200).json({
      success: true,
      message: "Service is healthy",
      data: {
        app: "up",
        database: "up",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
        dbTime: dbResult.rows[0].current_time
      }
    });
  } catch (error) {
    logger.error("Health check failed", {
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      message: "Service is unhealthy",
      data: {
        app: "up",
        database: "down",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
      },
      error: error.message
    });
  }
};

module.exports = {
  getHealth
};