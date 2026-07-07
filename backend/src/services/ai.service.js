const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Split large text into overlapping chunks for better analysis
 */
function chunkText(text, chunkSize = 3000, overlap = 300) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));
    start += chunkSize - overlap;
    if (start >= text.length) break;
  }
  return chunks;
}

/**
 * Analyze a single chunk and return clauses
 */
async function analyzeChunk(chunk, filename, chunkIndex, totalChunks) {
  const prompt = `You are an expert Indian legal document analyst. Analyze this section (${chunkIndex + 1}/${totalChunks}) of a legal document.

Filename: "${filename}"
Text:
"""
${chunk}
"""

Return ONLY valid JSON (no markdown):
{
  "clauses": [
    {
      "title": "<specific clause name>",
      "type": "risk|benefit|opportunity|neutral",
      "severity": <1-5>,
      "text": "<plain language explanation, 2-3 sentences>",
      "originalText": "<exact short quote from document if possible>",
      "score": <integer 0-100, 0=very unfavorable to signer, 100=very favorable>,
      "negotiable": <true|false>,
      "redFlag": <true|false>,
      "negotiationTip": "<specific actionable tip if negotiable, else null>"
    }
  ]
}

Rules:
- Only extract clauses actually present in this text
- Be specific — name exact clause types (e.g. "Liquidated Damages", "Non-Compete", "Auto-Renewal")
- redFlag=true for: hidden penalties, one-sided termination, IP grabs, unlimited liability, auto-renewal traps
- negotiationTip must be actionable (e.g. "Request cap at 2 months fee" not just "negotiate this")
- score: risk=10-35, neutral=40-60, benefit=65-90, opportunity=70-95`;

  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 2000,
  });

  const raw = res.choices[0]?.message?.content || '';
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return { clauses: [] };
  try { return JSON.parse(match[0]); } catch { return { clauses: [] }; }
}

/**
 * Generate final summary, timeline, red flags, negotiation tips
 */
async function generateSummary(text, filename, allClauses, language) {
  const clauseList = allClauses
    .map(c => `- ${c.title} (${c.type}, severity ${c.severity}/5, score ${c.score}/100, redFlag: ${c.redFlag})`)
    .join('\n');

  const prompt = `You are an expert legal document analyst. Generate a comprehensive assessment.

Filename: "${filename}"
Response Language: ${language}

Document Text (first 2000 chars):
"""
${text.substring(0, 2000)}
"""

Analyzed Clauses:
${clauseList}

Return ONLY valid JSON (no markdown):
{
  "documentType": "NDA|Lease|Employment|Service|Government|Loan|Partnership|Other",
  "riskScore": <integer 0-100>,
  "overallScore": <integer 0-100, 0=very bad deal, 100=excellent deal>,
  "summary": "<4-5 sentence plain language summary in ${language}>",
  "executiveVerdict": "<1 strong sentence — is this a good or bad document? in ${language}>",
  "redFlags": ["<critical warning in ${language}>"],
  "negotiationTips": ["<specific actionable negotiation point in ${language}>"],
  "timeline": [
    {
      "event": "<event name in ${language}>",
      "date": "<date or timeframe found in document, or null>",
      "importance": "high|medium|low"
    }
  ],
  "partyFavorability": "party1|party2|balanced",
  "recommendedActions": ["<specific action to take before signing in ${language}>"],
  "verification": {
    "structureValid": <true|false>,
    "requiredFieldsPresent": <true|false>,
    "formatConsistent": <true|false>,
    "suspiciousPatterns": <true|false>,
    "verdict": "authentic|suspicious|unclear",
    "verdictText": "<2 sentence verdict in ${language}>"
  }
}`;

  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.15,
    max_tokens: 2000,
  });

  const raw = res.choices[0]?.message?.content || '';
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('AI summary generation failed');
  return JSON.parse(match[0]);
}

/**
 * Main analysis function — chunked, accurate, multilingual
 */
async function analyzeDocument(text, filename, language = 'English') {
  console.log(`📄 Analyzing ${text.length} chars | Language: ${language}`);

  const chunks = chunkText(text, 3000, 300);
  console.log(`📦 Split into ${chunks.length} chunks`);

  // Analyze chunks (max 5 to avoid rate limits)
  const chunksToProcess = chunks.slice(0, 5);
  const chunkResults = await Promise.all(
    chunksToProcess.map((chunk, i) => analyzeChunk(chunk, filename, i, chunksToProcess.length))
  );

  // Merge and deduplicate clauses
  const allClauses = chunkResults.flatMap(r => r.clauses || []);
  const seen = new Set();
  const uniqueClauses = allClauses.filter(c => {
    const key = c.title?.toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`✅ Found ${uniqueClauses.length} unique clauses`);

  const summary = await generateSummary(text, filename, uniqueClauses, language);

  return {
    documentType: summary.documentType || 'Other',
    riskScore: summary.riskScore || 50,
    overallScore: summary.overallScore || 50,
    summary: summary.summary || '',
    executiveVerdict: summary.executiveVerdict || '',
    redFlags: summary.redFlags || [],
    negotiationTips: summary.negotiationTips || [],
    timeline: summary.timeline || [],
    partyFavorability: summary.partyFavorability || 'balanced',
    recommendedActions: summary.recommendedActions || [],
    clauses: uniqueClauses,
    riskCount: uniqueClauses.filter(c => c.type === 'risk').length,
    benefitCount: uniqueClauses.filter(c => c.type === 'benefit').length,
    opportunityCount: uniqueClauses.filter(c => c.type === 'opportunity').length,
    neutralCount: uniqueClauses.filter(c => c.type === 'neutral').length,
    redFlagCount: uniqueClauses.filter(c => c.redFlag).length,
    negotiableCount: uniqueClauses.filter(c => c.negotiable).length,
    verification: summary.verification || {},
  };
}

module.exports = { analyzeDocument };