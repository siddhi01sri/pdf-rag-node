const fs = require("fs");
const path = require("path");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

// In Node.js, we don't need a worker file here
pdfjsLib.GlobalWorkerOptions.workerSrc = null;

// Important: add trailing slash at the end
const standardFontDataUrl =
  path.join(process.cwd(), "node_modules", "pdfjs-dist", "standard_fonts") + "\\";

const extractTextFromPdf = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(dataBuffer);

    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      stopAtErrors: false,
      ignoreErrors: true,
      standardFontDataUrl
    });

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    let fullText = "";

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return {
      success: true,
      text: fullText,
      numberOfPages: numPages,
      info: {}
    };
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

module.exports = { extractTextFromPdf };
