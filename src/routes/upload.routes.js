const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { uploadPdf } = require("../controllers/upload.controller");

// POST /api/upload
router.post("/upload/pdf", upload.single("pdf"), uploadPdf);

module.exports = router;
