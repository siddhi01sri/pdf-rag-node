const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadPdf } = require("../controllers/uploadController");

// POST /api/upload
router.post("/upload/pdf", upload.single("pdf"), uploadPdf);

module.exports = router;
