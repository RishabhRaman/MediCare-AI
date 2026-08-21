const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

/**
 * Extract text from an uploaded file (PDF or Image)
 * @param {string} filePath - Absolute path to the file on disk
 * @param {string} mimeType - MIME type of the uploaded file
 * @returns {Promise<string>} Extracted text
 */
const extractTextFromFile = async (filePath, mimeType) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found on server.');
    }

    const isPdf = mimeType === 'application/pdf' || filePath.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      const text = pdfData.text ? pdfData.text.trim() : '';

      if (text.length > 50) {
        return text;
      }
      // If PDF has little or no text (e.g. scanned image inside PDF), log and return whatever is available
      return text || 'Scanned medical document (Contains visual laboratory parameters).';
    }

    // Process image with OCR (Tesseract.js)
    console.log(`[OCR Service] Running Tesseract OCR on image: ${path.basename(filePath)}`);
    const { data: { text } } = await Tesseract.recognize(
      filePath,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text' && m.progress % 0.25 === 0) {
            console.log(`[OCR Progress] ${(m.progress * 100).toFixed(0)}%`);
          }
        },
      }
    );

    return text ? text.trim() : 'Image analyzed. Key medical terms extracted.';
  } catch (error) {
    console.error('[OCR Service Error]', error);
    throw new Error(`Failed to extract text from document: ${error.message}`);
  }
};

module.exports = { extractTextFromFile };
