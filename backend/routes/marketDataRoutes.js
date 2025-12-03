const express = require('express');
const router = express.Router();
const {
  getStockQuote,
  getCompanyProfile,
  getMarketStatus,
  getIPOCalendar,
  getAggregatedData
} = require('../controllers/marketDataController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/quote/:symbol', getStockQuote);
router.get('/profile/:symbol', getCompanyProfile);
router.get('/market-status', getMarketStatus);
router.get('/ipo-calendar', getIPOCalendar);
router.get('/aggregated/:symbol', getAggregatedData);

module.exports = router;
