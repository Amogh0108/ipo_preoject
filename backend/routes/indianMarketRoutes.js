const express = require('express');
const router = express.Router();
const {
  getAllStocks,
  getStockPrice,
  getStockPrices,
  getIndices,
  searchStocks,
  getPopularStocks
} = require('../controllers/indianMarketController');
const { protect } = require('../middleware/auth');

// Public routes (no authentication required for demo)
router.get('/all-stocks', getAllStocks);
router.get('/indices', getIndices);
router.get('/popular', getPopularStocks);
router.get('/search', searchStocks);
router.get('/price/:symbol', getStockPrice);
router.get('/prices', getStockPrices);

// Protected routes (require authentication)
router.use(protect);
router.get('/my-watchlist', (req, res) => {
  res.json({ success: true, message: 'Watchlist feature coming soon' });
});

module.exports = router;
