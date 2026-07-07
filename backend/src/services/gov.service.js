const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Verify government document using AI pattern analysis
 * @param {string} text - Extracted text from document
 * @param {string} filename - Original file name
 * @returns {Object} Verification result
 */
async function verifyGovDocument(text, filename) {
  const truncatedText = text.substring(0, 4000);

  const prompt = `You are an expert Indian government document verification specialist.

Analyze this document and respond ONLY with valid JSON (no markdown, no extra text):

Filename: "${filename}"
Document Text:
"""
${truncatedText}
"""

Return exactly this JSON structure:
{
  "documentType": "Aadhaar|PAN|Passport|VoterID|DrivingLicense|Ration Card|BirthCertificate|IncomeCertificate|Other",
  "issuingAuthority": "<detected issuing authority or null>",
  "detectedFields": {
    "name": "<name found or null>",
    "dob": "<date of birth found or null>",
    "idNumber": "<ID number found or null>",
    "address": "<address found or null>",
    "issueDate": "<issue date or null>",
    "expiryDate": "<expiry date or null>"
  },
  "formatChecks": {
    "aadhaarFormat": <true if 12-digit number found, false otherwise>,
    "panFormat": <true if PAN format AAAAA9999A found, false otherwise>,
    "hasPhoto": <true|false based on text clues>,
    "hasSignature": <true|false>,
    "hasWatermark": <true|false based on text clues>,
    "hasIssuingAuthority": <true|false>,
    "hasHologramMention": <true|false>
  },
  "suspiciousIndicators": [
    "<list any suspicious patterns found, empty array if none>"
  ],
  "missingFields": [
    "<list required fields that are missing>"
  ],
  "authenticityScore": <integer 0-100, 100 = very likely authentic>,
  "verdict": "authentic|suspicious|fake|unclear",
  "verdictReason": "<2-3 sentence explanation of verdict>",
  "recommendations": [
    "<actionable recommendation for the user>"
  ]
}

Rules:
- Aadhaar: must have 12-digit number in format XXXX XXXX XXXX
- PAN: must match format AAAAA9999A (5 letters, 4 digits, 1 letter)
- Check for government seals, UIDAI/Income Tax mentions
- Flag if formatting looks inconsistent or fields are missing
- authenticityScore > 70 = authentic, 40-70 = unclear, < 40 = suspicious`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 1500,
  });

  const raw = completion.choices[0]?.message?.content || '';
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI returned invalid response format');

  return JSON.parse(jsonMatch[0]);
}

module.exports = { verifyGovDocument };