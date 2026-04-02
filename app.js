const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// routes
const uploadRoutes = require("./src/routes/upload.routes");
const chatRoutes = require("./src/routes/chat.routes");

// middlewares
app.use(express.json());

// base route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PDF RAG API Running 🚀"
  });
});

// API routes

app.use("/api/v1", uploadRoutes);
app.use("/api/chat", chatRoutes);


// global error handler (basic)
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});