const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

// Suppress the GlobalWorkerOptions warning in Node.js
pdfjsLib.GlobalWorkerOptions.workerSrc = null;

const extractTextFromPdf = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(dataBuffer);

    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      stopAtErrors: false,       // tolerate bad XRef entries
      ignoreErrors: true,        // skip pages with rendering errors
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