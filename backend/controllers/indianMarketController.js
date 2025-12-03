const indianMarketService = require('../services/indianMarketService');

// Get all NSE stocks
exports.getAllStocks = async (req, res, next) => {
  try {
    const data = await indianMarketService.getAllNSEStocks();
    
    if (!data.success) {
      return res.status(503).json({ 
        success: false, 
        message: 'Unable to fetch stock data',
        error: data.error 
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Get specific stock price
exports.getStockPrice = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const data = await indianMarketService.getStockPrice(symbol.toUpperCase());

    if (!data.success) {
      return res.status(404).json({ 
        success: false, 
        message: 'Stock not found',
        error: data.error 
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Get multiple stock prices
exports.getStockPrices = async (req, res, next) => {
  try {
    const { symbols } = req.query;
    
    if (!symbols) {
      return res.status(400).json({ 
        success: false, 
        message: 'Symbols parameter is required' 
      });
    }

    const symbolArray = symbols.split(',').map(s => s.trim().toUpperCase());
    const data = await indianMarketService.getStockPrices(symbolArray);

    if (!data.success) {
      return res.status(503).json({ 
        success: false, 
        message: 'Unable to fetch stock prices',
        error: data.error 
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Get all major indices
exports.getIndices = async (req, res, next) => {
  try {
    const data = await indianMarketService.getAllIndices();

    if (!data.success) {
      return res.status(503).json({ 
        success: false, 
        message: 'Unable to fetch indices data',
        error: data.error 
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Search stocks
exports.searchStocks = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query (q) is required' 
      });
    }

    const data = await indianMarketService.searchStock(q);

    if (!data.success) {
      return res.status(503).json({ 
        success: false, 
        message: 'Search failed',
        error: data.error 
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Get popular stocks
exports.getPopularStocks = async (req, res, next) => {
  try {
    const data = await indianMarketService.getPopularStocks();

    if (!data.success) {
      return res.status(503).json({ 
        success: false, 
        message: 'Unable to fetch popular stocks',
        error: data.error 
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
