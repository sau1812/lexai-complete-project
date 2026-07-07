const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const EXCEL_PATH = path.join(__dirname, '../../data/aadhaar_database.xlsx');

/**
 * Load all records from Excel file
 */
function loadExcelData() {
  if (!fs.existsSync(EXCEL_PATH)) {
    throw new Error('Database Excel file not found. Run: node data/createSampleExcel.js');
  }

  const wb = XLSX.readFile(EXCEL_PATH);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const records = XLSX.utils.sheet_to_json(sheet);
  return records;
}

/**
 * Normalize string for comparison — remove spaces, lowercase
 */
function normalize(str) {
  if (!str) return '';
  return String(str).toLowerCase().replace(/\s+/g, '').trim();
}

/**
 * Normalize Aadhaar number — remove spaces and dashes
 */
function normalizeAadhaar(num) {
  if (!num) return '';
  return String(num).replace(/[\s\-]/g, '').trim();
}

/**
 * Normalize date — handle DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD formats
 */
function normalizeDate(dob) {
  if (!dob) return '';
  const str = String(dob).trim();

  // DD/MM/YYYY or DD-MM-YYYY → normalize to DDMMYYYY
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(str)) {
    return str.replace(/[\/\-]/g, '');
  }
  // YYYY-MM-DD → convert to DDMMYYYY
  if (/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(str)) {
    const parts = str.split(/[\/\-]/);
    return `${parts[2]}${parts[1]}${parts[0]}`;
  }
  return str.replace(/[\/\-\s]/g, '');
}

/**
 * Extract Aadhaar number from OCR text
 */
function extractAadhaarFromText(text) {
  // Match 12-digit number with optional spaces (XXXX XXXX XXXX)
  const match = text.match(/\b(\d{4}[\s]?\d{4}[\s]?\d{4})\b/);
  return match ? match[1] : null;
}

/**
 * Extract name from OCR text (lines after common keywords)
 */
function extractNameFromText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (line.includes('name') || line.includes('naam')) {
      // Next line or same line after colon
      const colonPart = lines[i].split(':')[1]?.trim();
      if (colonPart && colonPart.length > 2) return colonPart;
      if (lines[i + 1] && lines[i + 1].length > 2) return lines[i + 1];
    }
  }

  // Try to find capitalized name
  const nameMatch = text.match(/(?:Name|नाम)\s*[:\-]?\s*([A-Za-z\s]{3,30})/i);
  return nameMatch ? nameMatch[1].trim() : null;
}

/**
 * Extract DOB from OCR text
 */
function extractDOBFromText(text) {
  // Match DD/MM/YYYY or DD-MM-YYYY pattern
  const match = text.match(/\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})\b/);
  return match ? match[1] : null;
}

/**
 * Main verification function
 * @param {string} extractedText - OCR text from document
 * @returns {Object} verification result
 */
function verifyAgainstExcel(extractedText) {
  const records = loadExcelData();

  // Extract fields from OCR text
  const extractedAadhaar = extractAadhaarFromText(extractedText);
  const extractedName    = extractNameFromText(extractedText);
  const extractedDOB     = extractDOBFromText(extractedText);

  console.log('📋 Extracted → Aadhaar:', extractedAadhaar, '| Name:', extractedName, '| DOB:', extractedDOB);

  if (!extractedAadhaar) {
    return {
      verdict: 'unclear',
      reason: 'Could not extract Aadhaar number from document.',
      extractedData: { aadhaar: null, name: extractedName, dob: extractedDOB },
      matchedRecord: null,
      fieldMatches: {},
      authenticityScore: 20,
    };
  }

  // Find matching record by Aadhaar number
  const matchedRecord = records.find(r =>
    normalizeAadhaar(r.aadhaar_number) === normalizeAadhaar(extractedAadhaar)
  );

  if (!matchedRecord) {
    return {
      verdict: 'fake',
      reason: `Aadhaar number ${extractedAadhaar} not found in database.`,
      extractedData: { aadhaar: extractedAadhaar, name: extractedName, dob: extractedDOB },
      matchedRecord: null,
      fieldMatches: { aadhaar: false },
      authenticityScore: 5,
    };
  }

  // Compare fields
  const fieldMatches = {
    aadhaar: true, // already matched above
    name: extractedName
      ? normalize(extractedName).includes(normalize(matchedRecord.name)) ||
        normalize(matchedRecord.name).includes(normalize(extractedName))
      : null,
    dob: extractedDOB
      ? normalizeDate(extractedDOB) === normalizeDate(matchedRecord.dob)
      : null,
  };

  const matchCount  = Object.values(fieldMatches).filter(v => v === true).length;
  const totalFields = Object.values(fieldMatches).filter(v => v !== null).length;
  const matchScore  = Math.round((matchCount / totalFields) * 100);

  let verdict, reason;

  if (matchScore >= 80) {
    verdict = 'authentic';
    reason  = `All key fields matched with database. Aadhaar verified successfully.`;
  } else if (matchScore >= 50) {
    verdict = 'suspicious';
    reason  = `Aadhaar number found but some fields don't match. Manual verification recommended.`;
  } else {
    verdict = 'fake';
    reason  = `Aadhaar number found but critical fields (name/DOB) don't match database records.`;
  }

  return {
    verdict,
    reason,
    extractedData: {
      aadhaar: extractedAadhaar,
      name: extractedName,
      dob: extractedDOB,
    },
    matchedRecord: {
      aadhaar_number: matchedRecord.aadhaar_number,
      name: matchedRecord.name,
      dob: matchedRecord.dob,
      state: matchedRecord.state,
    },
    fieldMatches,
    authenticityScore: matchScore,
  };
}

/**
 * Add a new record to Excel (for admin use)
 */
function addRecordToExcel(record) {
  const records = loadExcelData();
  records.push(record);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(records);
  XLSX.utils.book_append_sheet(wb, ws, 'Aadhaar Records');
  XLSX.writeFile(wb, EXCEL_PATH);

  return { success: true, totalRecords: records.length };
}

/**
 * Get all records (for admin dashboard)
 */
function getAllRecords() {
  return loadExcelData();
}

module.exports = { verifyAgainstExcel, addRecordToExcel, getAllRecords };