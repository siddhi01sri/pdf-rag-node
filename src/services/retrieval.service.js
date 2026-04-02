const {
  matchDocumentChunks,
  matchChunksByDocumentId
} = require("../repositories/chunk.repository");

const retrieveRelevantChunks = async ({ queryEmbedding, topK = 5, documentId = null }) => {
  if (documentId) {
    return await matchChunksByDocumentId(documentId, queryEmbedding, topK);
  }

  return await matchDocumentChunks(queryEmbedding, topK);
};

module.exports = {
  retrieveRelevantChunks
};