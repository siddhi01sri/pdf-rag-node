const express = require("express");
const {
  listDocuments,
  getDocument
} = require("../controllers/document.controller");

const router = express.Router();

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: List all uploaded documents
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: List of documents retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   original_name: "sample.pdf"
 *                   file_name: "uploaded-file.pdf"
 *                   size: 120394
 *                   total_chunks: 15
 *                   created_at: "2023-10-27T10:00:00.000Z"
 *       500:
 *         description: Internal server error
 */
router.get("/", listDocuments);

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Get a specific document by ID
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 original_name: "sample.pdf"
 *                 file_name: "uploaded-file.pdf"
 *                 size: 120394
 *                 total_chunks: 15
 *                 created_at: "2023-10-27T10:00:00.000Z"
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getDocument);

module.exports = router;