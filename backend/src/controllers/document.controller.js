const fs = require('fs');
const Document = require('../models/Document.model');
const User = require('../models/User.model');
const { extractText, verifyDocumentPatterns } = require('../services/ocr.service');
const { analyzeDocument } = require('../services/ai.service');

const LANG_MAP = {
  en: 'English', hi: 'Hindi', mr: 'Marathi',
  gu: 'Gujarati', ta: 'Tamil', te: 'Telugu',
};

// POST /api/documents/upload
const uploadDocument = async (req, res) => {
  let filePath = null;
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    filePath = req.file.path;
    const langCode = req.body.language || 'en';
    const language = LANG_MAP[langCode] || 'English';

    const doc = await Document.create({
      user: req.user._id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      language,
      status: 'processing',
    });

    console.log(`📄 Extracting: ${req.file.originalname} | Lang: ${language}`);
    const extracted = await extractText(filePath, req.file.mimetype);

    if (!extracted.text || extracted.text.trim().length < 20) {
      await Document.findByIdAndUpdate(doc._id, { status: 'failed', errorMessage: 'No readable text found.' });
      return res.status(422).json({ error: 'Document has no readable text.' });
    }

    const patterns = verifyDocumentPatterns(extracted.text);
    console.log(`🤖 AI Analysis starting...`);
    const analysis = await analyzeDocument(extracted.text, req.file.originalname, language);

    const updatedDoc = await Document.findByIdAndUpdate(
      doc._id,
      {
        documentType: analysis.documentType || 'Other',
        summary: analysis.summary,
        executiveVerdict: analysis.executiveVerdict,
        riskScore: analysis.riskScore,
        overallScore: analysis.overallScore,
        partyFavorability: analysis.partyFavorability,
        clauses: analysis.clauses,
        timeline: analysis.timeline,
        redFlags: analysis.redFlags,
        negotiationTips: analysis.negotiationTips,
        recommendedActions: analysis.recommendedActions,
        riskCount: analysis.riskCount,
        benefitCount: analysis.benefitCount,
        opportunityCount: analysis.opportunityCount,
        neutralCount: analysis.neutralCount,
        redFlagCount: analysis.redFlagCount,
        negotiableCount: analysis.negotiableCount,
        verification: {
          ...analysis.verification,
          idFormatValid: patterns.hasAadhaar || patterns.hasPAN,
          verifiedAt: new Date(),
        },
        extractedText: extracted.text.substring(0, 5000),
        status: 'completed',
      },
      { new: true }
    );

    await User.findByIdAndUpdate(req.user._id, { $inc: { documentsAnalyzed: 1 } });
    console.log(`✅ Done: ${req.file.originalname}`);

    res.status(201).json({ message: 'Document analyzed successfully!', document: updatedDoc });
  } catch (error) {
    console.error('Upload error:', error);
    if (filePath) {
      await Document.findOneAndUpdate({ filePath }, { status: 'failed', errorMessage: error.message }).catch(() => {});
    }
    res.status(500).json({ error: 'Analysis failed: ' + (error.message || 'Unknown error') });
  }
};

// GET /api/documents
const getDocuments = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.documentType = type;
    if (status) filter.status = status;

    const total = await Document.countDocuments(filter);
    const documents = await Document.find(filter)
      .select('-extractedText')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ documents, pagination: { total, page: Number(page), pages: Math.ceil(total / limit), limit: Number(limit) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents.' });
  }
};

// GET /api/documents/:id
const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
    if (!document) return res.status(404).json({ error: 'Document not found.' });
    res.json({ document });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch document.' });
  }
};

// DELETE /api/documents/:id
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
    if (!document) return res.status(404).json({ error: 'Document not found.' });
    if (fs.existsSync(document.filePath)) fs.unlinkSync(document.filePath);
    await Document.findByIdAndDelete(document._id);
    res.json({ message: 'Document deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document.' });
  }
};

module.exports = { uploadDocument, getDocuments, getDocument, deleteDocument };