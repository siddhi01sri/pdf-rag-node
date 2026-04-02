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

const matchChunksByDocumentId = async (documentId, queryEmbedding, matchCount = 5) => {
  const query = `
    select
      dc.id,
      dc.document_id,
      dc.chunk_index,
      dc.content,
      1 - (dc.embedding <=> $2::vector) as similarity
    from document_chunks dc
    where dc.document_id = $1
    order by dc.embedding <=> $2::vector
    limit $3;
  `;

  const values = [documentId, JSON.stringify(queryEmbedding), matchCount];
  const { rows } = await pool.query(query, values);
  return rows;
};

module.exports = {
  insertChunk,
  insertChunksBulk,
  matchDocumentChunks,
  matchChunksByDocumentId
};