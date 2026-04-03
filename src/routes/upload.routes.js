const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { uploadPdf } = require("../controllers/upload.controller");

/**
 * @swagger
 * /api/v1/upload/pdf:
 *   post:
 *     summary: Upload a PDF file
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - pdf
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: PDF uploaded and processed successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: File uploaded and processed successfully
 *               data:
 *                 fileName: uploaded-file.pdf
 *                 originalName: sample.pdf
 *                 size: 120394
 *                 documentId: 1
 *                 totalChunks: 15
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Internal server error
 */

// POST /api/upload
router.post("/upload/pdf", upload.single("pdf"), uploadPdf);

module.exports = router;
