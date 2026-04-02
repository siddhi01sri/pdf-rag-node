const { createEmbedding } = require("../services/embedding.service");
const { retrieveRelevantChunks } = require("../services/retrieval.service");
const { generateAnswer } = require("../services/llm.service");

const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required"
      });
    }

    const queryEmbedding = await createEmbedding(question);
    const matchedChunks = await retrieveRelevantChunks(queryEmbedding, 5);

    if (!matchedChunks || matchedChunks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No relevant content found. Please upload a PDF first."
      });
    }

    const answer = await generateAnswer(question, matchedChunks);

    return res.status(200).json({
      success: true,
      message: "Answer generated successfully",
      data: {
        question,
        answer,
        sources: matchedChunks
      }
    });
  } catch (error) {
    console.error("Question answering failed:", error);

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