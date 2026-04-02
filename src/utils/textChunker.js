const chunkText = (text, chunkSize = 500, overlap = 100) => {
  if (!text) return [];

  const cleaned = text.replace(/\s+/g, " ").trim();
  const chunks = [];

  let start = 0;

  while (start < cleaned.length) {
    const end = start + chunkSize;
    const chunk = cleaned.slice(start, end).trim();

    if (chunk) chunks.push(chunk);

    start += chunkSize - overlap;
  }

  return chunks;
};

module.exports = { chunkText };