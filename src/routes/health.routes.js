const express = require("express");
const { getHealth } = require("../controllers/health.controller");

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: API is healthy
 *               data:
 *                 status: "healthy"
 *                 timestamp: "2023-10-27T10:00:00.000Z"
 *       500:
 *         description: Internal server error
 */
router.get("/", getHealth);

module.exports = router;