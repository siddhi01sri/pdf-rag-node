const path = require("path");
const { extractTextFromPdf } = require("../services/pdf.service");

const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const filePath = path.join(process.cwd(), req.file.path);

    const parsedPdf = await extractTextFromPdf(filePath);

    return res.status(200).json({
      success: true,
      message: "File uploaded and parsed successfully",
      data: {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        numberOfPages: parsedPdf.numberOfPages,
        extractedTextPreview: parsedPdf.text.substring(0, 1000)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "PDF upload or parsing failed",
      error: error.message
    });
  }
};

module.exports = { uploadPdf };