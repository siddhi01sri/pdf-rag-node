const pool = require("../config/db");

const insertChunk = async ({ documentId, chunkIndex, content, embedding }) => {
  const query = `
    insert into document_chunks (document_id, chunk_index, content, embedding)
    values ($1, $2, $3, $4::vector)
    returning *;
  `;

  const values = [
    documentId,
    chunkIndex,
    content,
    JSON.stringify(embedding)
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const insertChunksBulk = async (chunks) => {
  for (const chunk of chunks) {
    await insertChunk(chunk);
  }
};

const matchDocumentChunks = async (queryEmbedding, matchCount = 5) => {
  const query = `
    select *
    from match_document_chunks($1::vector, $2);
  `;

  const values = [JSON.stringify(queryEmbedding), matchCount];
  const { rows } = await pool.query(query, values);
  return rows;
};

module.exports = {
  insertChunk,
  insertChunksBulk,
  matchDocumentChunks
};