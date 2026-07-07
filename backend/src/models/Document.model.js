const mongoose = require('mongoose');

const clauseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['risk', 'benefit', 'opportunity', 'neutral'], required: true },
  severity: { type: Number, min: 1, max: 5, default: 3 },
  text: { type: String, required: true },
  originalText: { type: String, default: null },
  score: { type: Number, min: 0, max: 100, default: 50 },
  negotiable: { type: Boolean, default: false },
  redFlag: { type: Boolean, default: false },
  negotiationTip: { type: String, default: null },
});

const timelineSchema = new mongoose.Schema({
  event: { type: String, required: true },
  date: { type: String, default: null },
  importance: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
});

const verificationSchema = new mongoose.Schema({
  structureValid: { type: Boolean, default: false },
  requiredFieldsPresent: { type: Boolean, default: false },
  formatConsistent: { type: Boolean, default: false },
  suspiciousPatterns: { type: Boolean, default: false },
  idFormatValid: { type: Boolean, default: null },
  verdict: { type: String, enum: ['authentic', 'suspicious', 'unclear'], default: 'unclear' },
  verdictText: { type: String, default: '' },
  verifiedAt: { type: Date, default: Date.now },
});

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    language: { type: String, default: 'English' },

    // AI Analysis
    documentType: {
      type: String,
      enum: ['NDA', 'Lease', 'Employment', 'Service', 'Government', 'Loan', 'Partnership', 'Other'],
      default: 'Other',
    },
    summary: { type: String, default: '' },
    executiveVerdict: { type: String, default: '' },
    riskScore: { type: Number, min: 0, max: 100, default: 0 },
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
    partyFavorability: { type: String, enum: ['party1', 'party2', 'balanced'], default: 'balanced' },

    clauses: [clauseSchema],
    timeline: [timelineSchema],
    redFlags: [{ type: String }],
    negotiationTips: [{ type: String }],
    recommendedActions: [{ type: String }],

    riskCount: { type: Number, default: 0 },
    benefitCount: { type: Number, default: 0 },
    opportunityCount: { type: Number, default: 0 },
    neutralCount: { type: Number, default: 0 },
    redFlagCount: { type: Number, default: 0 },
    negotiableCount: { type: Number, default: 0 },

    verification: verificationSchema,
    extractedText: { type: String, default: '', select: false },

    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    errorMessage: { type: String, default: null },
  },
  { timestamps: true }
);

documentSchema.index({ user: 1, createdAt: -1 });
documentSchema.index({ user: 1, documentType: 1 });

module.exports = mongoose.model('Document', documentSchema);