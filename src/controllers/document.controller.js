const {
  getAllDocuments,
  getDocumentById
} = require("../repositories/document.repository");
const logger = require("../utils/logger");

const listDocuments = async (req, res) => {
  try {
    logger.info("Fetching all documents");

    const documents = await getAllDocuments();

    logger.info("Documents fetched successfully", {
      count: documents.length
    });

    return res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      data: documents
    });
  } catch (error) {
    logger.error("Failed to fetch documents", {
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
      error: error.message
    });
  }
};

const getDocument = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info("Fetching document by id", {
      documentId: id
    });

    const document = await getDocumentById(id);

    if (!document) {
      logger.warn("Document not found", {
        documentId: id
      });

      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    logger.info("Document fetched successfully", {
      documentId: id,
      originalName: document.original_name
    });

    return res.status(200).json({
      success: true,
      message: "Document fetched successfully",
      data: document
    });
  } catch (error) {
    logger.error("Failed to fetch document", {
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      message: "Failed to fetch document",
      error: error.message
    });
  }
};

module.exports = {
  listDocuments,
  getDocument
};