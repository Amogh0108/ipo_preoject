const marketDataService = require('../services/marketDataService');

exports.getStockQuote = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const data = await marketDataService.getStockQuote(symbol);

    if (!data) {
      return res.status(404).json({ success: false, message: 'Stock data not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getCompanyProfile = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const data = await marketDataService.getCompanyProfile(symbol);

    if (!data) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getMarketStatus = async (req, res, next) => {
  try {
    const data = await marketDataService.getMarketStatus();

    if (!data) {
      return res.status(503).json({ success: false, message: 'Market data unavailable' });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getIPOCalendar = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const data = await marketDataService.getIPOCalendar(from, to);

    if (!data) {
      return res.status(404).json({ success: false, message: 'IPO calendar not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getAggregatedData = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const data = await marketDataService.getAggregatedMarketData(symbol);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
