const { matchDocumentChunks } = require("../repositories/chunk.repository");

const retrieveRelevantChunks = async (queryEmbedding, topK = 5) => {
  const matchedChunks = await matchDocumentChunks(queryEmbedding, topK);
  return matchedChunks;
};

module.exports = {
  retrieveRelevantChunks
};