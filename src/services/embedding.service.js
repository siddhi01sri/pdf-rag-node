const ollama = require("ollama").default;

const createEmbedding = async (text) => {
  try {
    const response = await ollama.embed({
      model: process.env.EMBEDDING_MODEL,
      input: text
    });

    return response.embeddings[0];
  } catch (error) {
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
};

const createEmbeddingsForChunks = async (chunks) => {
  try {
    const embeddedChunks = [];

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await createEmbedding(chunks[i]);

      embeddedChunks.push({
        id: i + 1,
        text: chunks[i],
        embedding
      });
    }

    return embeddedChunks;
  } catch (error) {
    throw new Error(`Chunk embedding generation failed: ${error.message}`);
  }
};

module.exports = { createEmbedding, createEmbeddingsForChunks };