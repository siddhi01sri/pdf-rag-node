const express = require("express");
const { askQuestion } = require("../controllers/chat.controller");

const router = express.Router();

/**
 * @swagger
 * /api/chat/ask:
 *   post:
 *     summary: Ask a question about a specific document
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documentId
 *               - sessionId
 *               - question
 *             properties:
 *               documentId:
 *                 type: integer
 *                 description: ID of the document to ask about
 *               sessionId:
 *                 type: string
 *                 description: Session ID for chat history
 *               question:
 *                 type: string
 *                 description: The question to ask
 *     responses:
 *       200:
 *         description: Answer retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 answer: "The answer to your question"
 *                 sources:
 *                   - document_id: 1
 *                     chunk_index: 5
 *                     similarity: 0.85
 *                     content: "Relevant text from the document"
 *                 documentName: "sample.pdf"
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post("/ask", askQuestion);

module.exports = router;