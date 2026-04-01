const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");
const { uploadPdf } = require("../controllers/uploadController");

// versioned route
router.post("/v1/upload/pdf", upload.single("pdf"), uploadPdf);

module.exports = router;