const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

/**
 * Extract text from PDF using pdf-parse (text-based PDFs)
 */
async function extractFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    if (data.text && data.text.trim().length >= 50) {
      return {
        text: data.text,
        pageCount: data.numpages,
        method: 'pdf-parse',
      };
    }

    // Scanned PDF — Tesseract cannot read PDFs directly on Windows
    console.log('⚠ Scanned PDF detected. pdf-parse found minimal text.');
    return {
      text: data.text || '',
      pageCount: data.numpages,
      method: 'pdf-parse-minimal',
    };

  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
}

/**
 * Extract text from image using Tesseract OCR
 * Only call this for actual image files (jpg, png)
 */
async function extractWithOCR(filePath) {
  try {
    const {
      data: { text, confidence },
    } = await Tesseract.recognize(filePath, 'eng+hin', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          process.stdout.write(`\rOCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    console.log(`\nOCR completed. Confidence: ${confidence}%`);

    return {
      text: text || '',
      pageCount: 1,
      method: 'tesseract-ocr',
      confidence: Math.round(confidence),
    };
  } catch (error) {
    throw new Error(`OCR failed: ${error.message}`);
  }
}

/**
 * Extract text from plain text file
 */
function extractFromText(filePath) {
  const text = fs.readFileSync(filePath, 'utf-8');
  return { text, pageCount: 1, method: 'text' };
}

/**
 * Main extraction — routes to correct extractor based on mime type
 */
async function extractText(filePath, mimeType) {
  const ext = path.extname(filePath).toLowerCase();

  // Images → Tesseract OCR
  if (
    mimeType === 'image/jpeg' ||
    mimeType === 'image/jpg' ||
    mimeType === 'image/png' ||
    ['.jpg', '.jpeg', '.png'].includes(ext)
  ) {
    return await extractWithOCR(filePath);
  }

  // PDFs → pdf-parse only (Tesseract cannot read PDFs on Windows)
  if (mimeType === 'application/pdf' || ext === '.pdf') {
    return await extractFromPDF(filePath);
  }

  // Plain text
  if (mimeType === 'text/plain' || ext === '.txt') {
    return extractFromText(filePath);
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
}

/**
 * Verify government document patterns (Aadhaar, PAN, etc.)
 */
function verifyDocumentPatterns(text) {
  return {
    hasAadhaar: /\b\d{4}\s\d{4}\s\d{4}\b/.test(text),
    hasPAN: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/.test(text),
    hasDate: /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/.test(text),
    hasSignature: /signature|signed|sign here/i.test(text),
    hasParties: /party|parties|between|hereinafter/i.test(text),
    hasLegalTerms: /whereas|therefore|herein|pursuant|notwithstanding/i.test(text),
    hasAmounts: /₹|rs\.?|inr|rupees/i.test(text),
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
}

module.exports = { extractText, verifyDocumentPatterns };