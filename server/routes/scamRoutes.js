const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const ScamReport = require('../models/ScamReport');

// Validation middleware
const validateScamReport = [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('summary').trim().isLength({ min: 10, max: 2000 }).withMessage('Summary must be between 10 and 2000 characters'),
  body('tags').isArray({ min: 1 }).withMessage('At least one tag is required'),
  body('fraudScore').isInt({ min: 0, max: 100 }).withMessage('Fraud score must be between 0 and 100'),
  body('platform').isArray({ min: 1 }).withMessage('At least one platform is required'),
  body('regions').optional().isArray(),
  body('sourceUrls').optional().isArray(),
  body('detectionTips').optional().isArray()
];

// GET /api/scams - Get all scams with search and filters
router.get('/', [
  query('q').optional().trim(),
  query('tags').optional(),
  query('fraudScoreMin').optional().isInt({ min: 0, max: 100 }),
  query('fraudScoreMax').optional().isInt({ min: 0, max: 100 }),
  query('platform').optional(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('sort').optional().isIn(['createdAt', 'fraudScore', 'title'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      q, tags, fraudScoreMin, fraudScoreMax, platform,
      page = 1, limit = 20, sort = 'createdAt'
    } = req.query;

    // Build filters
    const filters = {};
    
    // Text search
    if (q) {
      filters.$text = { $search: q };
    }
    
    // Tag filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filters.tags = { $in: tagArray };
    }
    
    // Fraud score range filter
    if (fraudScoreMin || fraudScoreMax) {
      filters.fraudScore = {};
      if (fraudScoreMin) filters.fraudScore.$gte = parseInt(fraudScoreMin);
      if (fraudScoreMax) filters.fraudScore.$lte = parseInt(fraudScoreMax);
    }
    
    // Platform filter
    if (platform) {
      const platformArray = platform.split(',').map(p => p.trim());
      filters.platform = { $in: platformArray };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = sort === 'createdAt' ? -1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const scams = await ScamReport.find(filters)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Get total count for pagination
    const total = await ScamReport.countDocuments(filters);

    res.json({
      success: true,
      data: scams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching scams:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// GET /api/scams/trending - Get trending scams
router.get('/trending', [
  query('limit').optional().isInt({ min: 1, max: 20 })
], async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const trendingScams = await ScamReport.find()
      .sort({ fraudScore: -1, createdAt: -1 })
      .limit(limit)
      .select('-__v');

    res.json({
      success: true,
      data: trendingScams
    });

  } catch (error) {
    console.error('Error fetching trending scams:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// GET /api/scams/tags - Get all available tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await ScamReport.distinct('tags');
    res.json({
      success: true,
      data: tags.sort()
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// GET /api/scams/stats - Get scam statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await ScamReport.aggregate([
      {
        $group: {
          _id: null,
          totalScams: { $sum: 1 },
          avgFraudScore: { $avg: '$fraudScore' },
          highRiskScams: { $sum: { $cond: [{ $gte: ['$fraudScore', 80] }, 1, 0] } },
          totalRegions: { $addToSet: '$regions' }
        }
      }
    ]);

    const tagStats = await ScamReport.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalScams: stats[0]?.totalScams || 0,
        avgFraudScore: Math.round(stats[0]?.avgFraudScore || 0),
        highRiskScams: stats[0]?.highRiskScams || 0,
        totalViews: 0, // Not in new schema
        totalReports: 0, // Not in new schema
        tagStats: tagStats
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// GET /api/scams/search - Dedicated search endpoint
router.get('/search', [
  query('q').trim().notEmpty().withMessage('Search query is required'),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { q, limit = 20 } = req.query;
    
    // Perform text search with relevance scoring
    const results = await ScamReport.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(parseInt(limit))
    .select('-__v');

    // Get total count for this search
    const total = await ScamReport.countDocuments({ $text: { $search: q } });

    res.json({
      success: true,
      data: results,
      message: `Found ${results.length} results for "${q}"`,
      searchInfo: {
        query: q,
        totalResults: total,
        returnedResults: results.length
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: error.message
    });
  }
});

// GET /api/scams/:id - Get a specific scam by ID
router.get('/:id', async (req, res) => {
  try {
    const scam = await ScamReport.findById(req.params.id).select('-__v');
    
    if (!scam) {
      return res.status(404).json({ 
        success: false, 
        error: 'Scam not found' 
      });
    }

    res.json({
      success: true,
      data: scam
    });

  } catch (error) {
    console.error('Error fetching scam:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// POST /api/scams - Create a new scam report
router.post('/', validateScamReport, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const scam = new ScamReport(req.body);
    const savedScam = await scam.save();

    res.status(201).json({
      success: true,
      data: savedScam
    });

  } catch (error) {
    console.error('Error creating scam report:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// PUT /api/scams/:id - Update a scam report
router.put('/:id', validateScamReport, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedScam = await ScamReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedScam) {
      return res.status(404).json({ 
        success: false, 
        error: 'Scam not found' 
      });
    }

    res.json({
      success: true,
      data: updatedScam
    });

  } catch (error) {
    console.error('Error updating scam report:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// DELETE /api/scams/:id - Delete a scam report
router.delete('/:id', async (req, res) => {
  try {
    const deletedScam = await ScamReport.findByIdAndDelete(req.params.id);
    
    if (!deletedScam) {
      return res.status(404).json({ 
        success: false, 
        error: 'Scam not found' 
      });
    }

    res.json({
      success: true,
      message: 'Scam report deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting scam report:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router; 