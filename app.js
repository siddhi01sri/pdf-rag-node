const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");


dotenv.config();

const app = express();

// routes
const uploadRoutes = require("./src/routes/upload.routes");
const chatRoutes = require("./src/routes/chat.routes");
const documentRoutes = require("./src/routes/document.routes");
const healthRoutes = require("./src/routes/health.routes");

const logger = require("./src/utils/logger");
const redisClient = require("./src/config/redis");

// middlewares
app.use(express.json());

// base route
app.get("/", (req, res) => {
  logger.info("Base route accessed");

  res.status(200).json({
    success: true,
    message: "PDF RAG API Running 🚀"
  });
});

// API routes
app.use("/api/v1", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/health", healthRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// global error handler
app.use((err, req, res, next) => {
  logger.error("Unhandled application error", {
    error: err.message,
    method: req.method,
    url: req.originalUrl
  });

  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;

const startApp = async () => {
  try {
    await redisClient.connect();

    app.listen(PORT, () => {
      logger.info("Server started successfully", {
        port: PORT,
        environment: process.env.NODE_ENV || "development"
      });
    });
  } catch (error) {
    logger.error("Application startup failed", {
      error: error.message,
      stack: error.stack
    });

    process.exit(1);
  }
};

startApp();