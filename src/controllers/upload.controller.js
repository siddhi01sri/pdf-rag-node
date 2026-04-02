const path = require("path");
const { extractTextFromPdf } = require("../services/pdf.service");
const { chunkText } = require("../utils/textChunker");
const { createEmbeddingsForChunks } = require("../services/embedding.service");
const { createDocument } = require("../repositories/document.repository");
const { insertChunksBulk } = require("../repositories/chunk.repository");

const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const filePath = path.join(process.cwd(), req.file.path);

    const parsedPdf = await extractTextFromPdf(filePath);
    const chunks = chunkText(parsedPdf.text);
    const embeddedChunks = await createEmbeddingsForChunks(chunks);

    const document = await createDocument({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath,
      fileSize: req.file.size
    });


    const chunkRows = embeddedChunks.map((chunk, index) => ({
      documentId: document.id,
      chunkIndex: index,
      content: chunk.text,
      embedding: chunk.embedding
    }));

    await insertChunksBulk(chunkRows) ;
   
   return res.status(200).json({
  success: true,
  message: "PDF uploaded, parsed, embedded, and stored successfully",
  data: {
    documentId: document.id,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    numberOfPages: parsedPdf.numberOfPages,
    totalChunks: chunks.length,
    totalEmbeddings: embeddedChunks.length,
    extractedTextPreview: parsedPdf.text.substring(0, 500),
    chunkPreview: chunks.slice(0, 3)
  }
});
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "PDF upload or parsing failed",
      error: error.message
    });
  }
};

module.exports = { uploadPdf };