const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PDF RAG API",
      version: "1.0.0",
      description:
        "API documentation for PDF upload, document retrieval, chat-based question answering, and health checks."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server"
      }
    ],
    tags: [
      { name: "Upload", description: "PDF upload APIs" },
      { name: "Chat", description: "Question answering APIs" },
      { name: "Documents", description: "Document retrieval APIs" },
      { name: "Health", description: "Health check APIs" }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;