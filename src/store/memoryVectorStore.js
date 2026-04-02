let vectorStore = [];

const saveEmbeddings = (embeddedChunks) => {
  vectorStore = embeddedChunks;
  return vectorStore;
};

const getEmbeddings = () => {
  return vectorStore;
};

module.exports = { saveEmbeddings, getEmbeddings };