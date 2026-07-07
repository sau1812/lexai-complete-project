const { extractText } = require('../services/ocr.service');
const { verifyGovDocument } = require('../services/gov.service');

// Safe import — only works if xlsx is installed
let verifyAgainstExcel = null;
try {
  const excelService = require('../services/excelVerify.service');
  verifyAgainstExcel = excelService.verifyAgainstExcel;
} catch (e) {
  console.warn('⚠ Excel verification not available. Run: npm install xlsx');
}

// POST /api/verify/upload
const verifyDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { path: filePath, originalname, mimetype } = req.file;

    // Step 1: Extract text via OCR / pdf-parse
    console.log(`🔍 Extracting text: ${originalname}`);
    const extracted = await extractText(filePath, mimetype);

    if (!extracted.text || extracted.text.trim().length < 10) {
      return res.status(422).json({ error: 'Could not extract readable text from document.' });
    }

    // Step 2: AI-based format verification
    console.log(`🤖 Running AI format verification...`);
    const aiResult = await verifyGovDocument(extracted.text, originalname);

    // Step 3: Excel database matching
    console.log(`📊 Matching against Excel database...`);
    let excelResult = null;
    let excelError = null;

    try {
      excelResult = verifyAgainstExcel(extracted.text);
      console.log(`✅ Excel match verdict: ${excelResult.verdict}`);
    } catch (err) {
      excelError = err.message;
      console.warn('⚠ Excel verification skipped:', err.message);
    }

    // Step 4: Combine verdicts
    // Excel match takes priority if available
    let finalVerdict = aiResult.verdict;
    let finalScore   = aiResult.authenticityScore;
    let verdictSource = 'ai';

    if (excelResult) {
      finalVerdict  = excelResult.verdict;
      finalScore    = excelResult.authenticityScore;
      verdictSource = 'database';
    }

    // Cleanup uploaded file
    const fs = require('fs');
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({
      message: 'Verification complete',
      filename: originalname,
      extractionMethod: extracted.method,
      verdictSource,
      result: {
        ...aiResult,
        // Override with Excel results if available
        verdict: finalVerdict,
        authenticityScore: finalScore,
        verdictReason: excelResult?.reason || aiResult.verdictReason,

        // Database match details
        databaseMatch: excelResult ? {
          found: !!excelResult.matchedRecord,
          extractedData: excelResult.extractedData,
          matchedRecord: excelResult.matchedRecord,
          fieldMatches: excelResult.fieldMatches,
        } : null,

        databaseError: excelError,
      },
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      error: 'Verification failed: ' + (error.message || 'Unknown error'),
    });
  }
};

// GET /api/verify/records — see all Excel records (admin)
const getRecords = async (req, res) => {
  try {
    const excelService = require('../services/excelVerify.service');
    const records = excelService.getAllRecords();
    res.json({ records, total: records.length });
  } catch (error) {
    res.status(500).json({ error: 'Excel not available. Run: npm install xlsx && npm run create-excel' });
  }
};

// POST /api/verify/records — add new record to Excel (admin)
const addRecord = async (req, res) => {
  try {
    const excelService = require('../services/excelVerify.service');
    const { aadhaar_number, name, dob, gender, mobile, address, pincode, state } = req.body;
    if (!aadhaar_number || !name || !dob) {
      return res.status(400).json({ error: 'aadhaar_number, name and dob are required.' });
    }
    const result = excelService.addRecordToExcel({ aadhaar_number, name, dob, gender, mobile, address, pincode, state });
    res.json({ message: 'Record added successfully', ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { verifyDocument, getRecords, addRecord };