const ollama = require("ollama").default;
const logger = require("../utils/logger");

const createEmbedding = async (text) => {
  try {
    logger.info("Generating embedding", {
      textLength: text?.length || 0,
      model: process.env.EMBEDDING_MODEL
    });

    const response = await ollama.embed({
      model: process.env.EMBEDDING_MODEL,
      input: text
    });

    logger.info("Embedding generated successfully", {
      textLength: text?.length || 0,
      embeddingSize: response?.embeddings?.[0]?.length || 0
    });

    return response.embeddings[0];
  } catch (error) {
    logger.error("Embedding generation failed", {
      error: error.message,
      textLength: text?.length || 0,
      model: process.env.EMBEDDING_MODEL
    });

    throw new Error(`Embedding generation failed: ${error.message}`);
  }
};

const createEmbeddingsForChunks = async (chunks) => {
  try {
    logger.info("Chunk embedding generation started", {
      totalChunks: chunks.length
    });

    const embeddedChunks = [];

    for (let i = 0; i < chunks.length; i++) {
      logger.info("Generating embedding for chunk", {
        chunkIndex: i,
        chunkId: i + 1,
        chunkLength: chunks[i]?.length || 0
      });

      const embedding = await createEmbedding(chunks[i]);

      embeddedChunks.push({
        id: i + 1,
        text: chunks[i],
        embedding
      });
    }

    logger.info("Chunk embedding generation completed", {
      totalChunks: chunks.length
    });

    return embeddedChunks;
  } catch (error) {
    logger.error("Chunk embedding generation failed", {
      error: error.message,
      totalChunks: chunks?.length || 0
    });

    throw new Error(`Chunk embedding generation failed: ${error.message}`);
  }
};

module.exports = { createEmbedding, createEmbeddingsForChunks };