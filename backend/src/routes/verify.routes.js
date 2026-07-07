const express = require('express');
const router = express.Router();
const { verifyDocument, getRecords, addRecord } = require('../controllers/verify.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

// POST /api/verify/upload — verify a document
router.post('/upload', protect, upload.single('document'), verifyDocument);

// GET /api/verify/records — get all Excel records
router.get('/records', protect, getRecords);

// POST /api/verify/records — add new record to Excel
router.post('/records', protect, addRecord);

module.exports = router;