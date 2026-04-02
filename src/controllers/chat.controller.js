const { createEmbedding } = require("../services/embedding.service");
const { retrieveRelevantChunks } = require("../services/retrieval.service");
const { generateAnswer } = require("../services/llm.service");
const { getDocumentById } = require("../repositories/document.repository");
const {
  getSessionHistory,
  addMessageToSession
} = require("../store/chatMemory.store");
const logger = require("../utils/logger");

const askQuestion = async (req, res) => {
  try {
    const { question, documentId, sessionId } = req.body;

    if (!question) {
      logger.warn("Question missing in request body");

      return res.status(400).json({
        success: false,
        message: "Question is required"
      });
    }

    if (!documentId) {
      logger.warn("documentId missing in request body", { question });

      return res.status(400).json({
        success: false,
        message: "documentId is required"
      });
    }

    if (!sessionId) {
      logger.warn("sessionId missing in request body", { documentId });

      return res.status(400).json({
        success: false,
        message: "sessionId is required"
      });
    }

    logger.info("Question received", {
      question,
      documentId,
      sessionId
    });

    const document = await getDocumentById(documentId);

    if (!document) {
      logger.warn("Document not found for question", { documentId });

      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    const queryEmbedding = await createEmbedding(question);

    const matchedChunks = await retrieveRelevantChunks({
      queryEmbedding,
      topK: 5,
      documentId
    });

    if (!matchedChunks || matchedChunks.length === 0) {
      logger.warn("No relevant chunks found for document", {
        documentId,
        question
      });

      return res.status(404).json({
        success: false,
        message: "No relevant content found for this document"
      });
    }

    logger.info("Relevant chunks retrieved", {
      documentId,
      matchedChunkCount: matchedChunks.length
    });

    const chatHistory = await getSessionHistory(sessionId);

    const answer = await generateAnswer(question, matchedChunks, chatHistory);

    await addMessageToSession(sessionId, {
      question,
      answer,
      documentId,
      createdAt: new Date().toISOString()
    });

    logger.info("Answer generated successfully", {
      documentId,
      documentName: document.original_name,
      sessionId
    });

    return res.status(200).json({
      success: true,
      message: "Answer generated successfully",
      data: {
        documentId: document.id,
        documentName: document.original_name,
        sessionId,
        question,
        answer,
        sources: matchedChunks
      }
    });
  } catch (error) {
    logger.error("Question answering failed", {
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      message: "Question answering failed",
      error: error.message
    });
  }
};

module.exports = {
  askQuestion
};