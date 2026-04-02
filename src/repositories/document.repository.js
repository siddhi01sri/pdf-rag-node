const pool = require("../config/db");

const createDocument = async ({ filename, originalName, filePath, fileSize }) => {
  const query = `
    insert into documents (filename, original_name, file_path, file_size)
    values ($1, $2, $3, $4)
    returning *;
  `;

  const values = [filename, originalName, filePath, fileSize];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = {
  createDocument
};