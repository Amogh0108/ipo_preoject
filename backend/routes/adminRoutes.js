const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ipoDataService = require('../services/ipoDataService');

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

// Manually trigger IPO data sync
router.post('/sync-ipos', async (req, res) => {
  try {
    const result = await ipoDataService.syncIPOData();
    res.json({
      success: true,
      message: 'IPO data synced successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to sync IPO data',
      error: error.message
    });
  }
});

module.exports = router;
