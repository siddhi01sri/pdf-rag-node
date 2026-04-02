const express = require("express");
const {
  listDocuments,
  getDocument
} = require("../controllers/document.controller");

const router = express.Router();

router.get("/", listDocuments);
router.get("/:id", getDocument);

module.exports = router;