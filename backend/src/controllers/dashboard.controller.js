const Document = require('../models/Document.model');

// GET /api/dashboard/stats
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [total, byType, recentDocs, riskStats] = await Promise.all([
      // Total documents
      Document.countDocuments({ user: userId, status: 'completed' }),

      // Documents by type
      Document.aggregate([
        { $match: { user: userId, status: 'completed' } },
        { $group: { _id: '$documentType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Recent 5 documents
      Document.find({ user: userId, status: 'completed' })
        .select('originalName documentType riskScore createdAt verification.verdict')
        .sort({ createdAt: -1 })
        .limit(5),

      // Risk statistics
      Document.aggregate([
        { $match: { user: userId, status: 'completed' } },
        {
          $group: {
            _id: null,
            totalRisks: { $sum: '$riskCount' },
            totalBenefits: { $sum: '$benefitCount' },
            totalOpportunities: { $sum: '$opportunityCount' },
            avgRiskScore: { $avg: '$riskScore' },
            verifiedDocs: {
              $sum: {
                $cond: [{ $eq: ['$verification.verdict', 'authentic'] }, 1, 0],
              },
            },
            suspiciousDocs: {
              $sum: {
                $cond: [{ $eq: ['$verification.verdict', 'suspicious'] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    const stats = riskStats[0] || {
      totalRisks: 0,
      totalBenefits: 0,
      totalOpportunities: 0,
      avgRiskScore: 0,
      verifiedDocs: 0,
      suspiciousDocs: 0,
    };

    res.json({
      totalDocuments: total,
      documentsByType: byType,
      recentDocuments: recentDocs,
      ...stats,
      avgRiskScore: Math.round(stats.avgRiskScore || 0),
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats.' });
  }
};

module.exports = { getStats };
