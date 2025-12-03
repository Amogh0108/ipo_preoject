const axios = require('axios');

class IndianMarketService {
  constructor() {
    this.rapidApiKey = process.env.RAPIDAPI_KEY;
    this.rapidApiHost = process.env.RAPIDAPI_HOST || 'latest-stock-price.p.rapidapi.com';
    this.baseUrl = `https://${this.rapidApiHost}`;
    // Alternative free API endpoints
    this.nseBaseUrl = 'https://www.nseindia.com/api';
  }

  // Get all NSE stocks
  async getAllNSEStocks() {
    try {
      // Try NSE India API first (free, no key required)
      const response = await axios.get(`${this.nseBaseUrl}/equity-stockIndices?index=NIFTY%2050`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      });
      
      if (response.data && response.data.data) {
        return {
          success: true,
          source: 'NSE India API',
          data: response.data.data
        };
      }
    } catch (error) {
      console.log('NSE API Error, trying RapidAPI:', error.message);
      
      // Try RapidAPI as backup
      try {
        const response = await axios.get(`${this.baseUrl}/any`, {
          headers: {
            'X-RapidAPI-Key': this.rapidApiKey,
            'X-RapidAPI-Host': this.rapidApiHost
          }
        });
        return {
          success: true,
          source: 'RapidAPI - Indian Market',
          data: response.data
        };
      } catch (rapidError) {
        console.log('RapidAPI also failed, using demo data');
      }
    }
    
    // Return demo data as final fallback
    return this.getDemoAllStocks();
  }

  // Get specific stock price by symbol
  async getStockPrice(symbol) {
    try {
      const response = await axios.get(`${this.baseUrl}/price`, {
        params: { Indices: symbol },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': this.rapidApiHost
        }
      });
      return {
        success: true,
        source: 'RapidAPI - Indian Market',
        symbol: symbol,
        data: response.data
      };
    } catch (error) {
      console.error('RapidAPI Stock Price Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get stock prices by multiple symbols
  async getStockPrices(symbols) {
    try {
      const response = await axios.get(`${this.baseUrl}/prices`, {
        params: { Indices: symbols.join(',') },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': this.rapidApiHost
        }
      });
      return {
        success: true,
        source: 'RapidAPI - Indian Market',
        data: response.data
      };
    } catch (error) {
      console.error('RapidAPI Stock Prices Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get price for all indices
  async getAllIndices() {
    try {
      // Try NSE India API for indices (free, no key required)
      const [nifty50, niftyBank] = await Promise.all([
        axios.get(`${this.nseBaseUrl}/equity-stockIndices?index=NIFTY%2050`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0'
          }
        }),
        axios.get(`${this.nseBaseUrl}/equity-stockIndices?index=NIFTY%20BANK`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0'
          }
        })
      ]);

      const indices = [];
      
      if (nifty50.data && nifty50.data.data && nifty50.data.data[0]) {
        const niftyData = nifty50.data.data[0];
        indices.push({
          symbol: 'NIFTY 50',
          identifier: 'NIFTY 50',
          lastPrice: niftyData.last || niftyData.lastPrice,
          change: niftyData.change,
          pChange: niftyData.pChange || niftyData.perChange,
          open: niftyData.open,
          dayHigh: niftyData.dayHigh || niftyData.high,
          dayLow: niftyData.dayLow || niftyData.low,
          previousClose: niftyData.previousClose,
          totalTradedVolume: niftyData.totalTradedVolume,
          lastUpdateTime: new Date().toISOString()
        });
      }

      if (niftyBank.data && niftyBank.data.data && niftyBank.data.data[0]) {
        const bankData = niftyBank.data.data[0];
        indices.push({
          symbol: 'NIFTY BANK',
          identifier: 'NIFTY BANK',
          lastPrice: bankData.last || bankData.lastPrice,
          change: bankData.change,
          pChange: bankData.pChange || bankData.perChange,
          open: bankData.open,
          dayHigh: bankData.dayHigh || bankData.high,
          dayLow: bankData.dayLow || bankData.low,
          previousClose: bankData.previousClose,
          totalTradedVolume: bankData.totalTradedVolume,
          lastUpdateTime: new Date().toISOString()
        });
      }

      if (indices.length > 0) {
        return {
          success: true,
          source: 'NSE India API - Real Data',
          data: indices
        };
      }
    } catch (error) {
      console.log('NSE API Error, trying RapidAPI:', error.message);
      
      // Try RapidAPI as backup
      try {
        const response = await axios.get(`${this.baseUrl}/price`, {
          params: { Indices: 'NIFTY 50,NIFTY BANK,SENSEX' },
          headers: {
            'X-RapidAPI-Key': this.rapidApiKey,
            'X-RapidAPI-Host': this.rapidApiHost
          }
        });
        return {
          success: true,
          source: 'RapidAPI - Indian Market Indices',
          data: response.data
        };
      } catch (rapidError) {
        console.log('RapidAPI also failed, using demo data');
      }
    }
    
    // Return demo data as final fallback
    return this.getDemoIndices();
  }

  // Search for Indian stocks
  async searchStock(query) {
    try {
      const allStocks = await this.getAllNSEStocks();
      if (!allStocks.success) {
        return allStocks;
      }

      // Filter stocks based on query
      const filtered = allStocks.data.filter(stock => 
        stock.symbol?.toLowerCase().includes(query.toLowerCase()) ||
        stock.identifier?.toLowerCase().includes(query.toLowerCase())
      );

      return {
        success: true,
        source: 'RapidAPI - Indian Market',
        query: query,
        data: filtered.slice(0, 10) // Return top 10 results
      };
    } catch (error) {
      console.error('Search Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get popular Indian stocks
  async getPopularStocks() {
    const popularSymbols = [
      'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR',
      'ICICIBANK', 'SBIN', 'BHARTIARTL', 'ITC', 'KOTAKBANK'
    ];

    try {
      const response = await axios.get(`${this.baseUrl}/prices`, {
        params: { Indices: popularSymbols.join(',') },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': this.rapidApiHost
        }
      });
      return {
        success: true,
        source: 'RapidAPI - Popular Indian Stocks',
        data: response.data
      };
    } catch (error) {
      console.error('Popular Stocks Error:', error.message);
      // Return demo data as fallback
      return this.getDemoPopularStocks();
    }
  }

  // Format stock data for display
  formatStockData(stock) {
    return {
      symbol: stock.symbol || stock.identifier,
      name: stock.identifier || stock.symbol,
      price: stock.lastPrice || stock.close,
      change: stock.change || 0,
      changePercent: stock.pChange || stock.perChange || 0,
      open: stock.open,
      high: stock.dayHigh || stock.high,
      low: stock.dayLow || stock.low,
      volume: stock.totalTradedVolume || stock.volume,
      previousClose: stock.previousClose || stock.prevClose,
      lastUpdateTime: stock.lastUpdateTime || new Date().toISOString()
    };
  }

  // Demo data methods (fallback when API fails)
  getDemoIndices() {
    return {
      success: true,
      source: 'Demo Data - Indian Market Indices',
      data: [
        {
          symbol: 'NIFTY 50',
          identifier: 'NIFTY 50',
          lastPrice: 21456.65,
          change: 125.30,
          pChange: 0.59,
          open: 21350.00,
          dayHigh: 21480.50,
          dayLow: 21320.00,
          previousClose: 21331.35,
          totalTradedVolume: 245678900,
          lastUpdateTime: new Date().toISOString()
        },
        {
          symbol: 'SENSEX',
          identifier: 'SENSEX',
          lastPrice: 71234.50,
          change: 234.80,
          pChange: 0.33,
          open: 71050.00,
          dayHigh: 71280.00,
          dayLow: 71020.00,
          previousClose: 70999.70,
          totalTradedVolume: 189456700,
          lastUpdateTime: new Date().toISOString()
        },
        {
          symbol: 'NIFTY BANK',
          identifier: 'NIFTY BANK',
          lastPrice: 46789.25,
          change: -89.50,
          pChange: -0.19,
          open: 46900.00,
          dayHigh: 46950.00,
          dayLow: 46750.00,
          previousClose: 46878.75,
          totalTradedVolume: 156789000,
          lastUpdateTime: new Date().toISOString()
        }
      ]
    };
  }

  getDemoPopularStocks() {
    return {
      success: true,
      source: 'Demo Data - Popular Indian Stocks',
      data: [
        {
          symbol: 'RELIANCE',
          identifier: 'Reliance Industries Ltd',
          lastPrice: 2456.75,
          change: 25.30,
          pChange: 1.04,
          open: 2435.00,
          dayHigh: 2465.00,
          dayLow: 2430.00,
          previousClose: 2431.45,
          totalTradedVolume: 8765432,
          yearHigh: 2750.00,
          yearLow: 2100.00
        },
        {
          symbol: 'TCS',
          identifier: 'Tata Consultancy Services Ltd',
          lastPrice: 3678.50,
          change: 45.20,
          pChange: 1.24,
          open: 3640.00,
          dayHigh: 3690.00,
          dayLow: 3635.00,
          previousClose: 3633.30,
          totalTradedVolume: 2345678,
          yearHigh: 4050.00,
          yearLow: 3200.00
        },
        {
          symbol: 'HDFCBANK',
          identifier: 'HDFC Bank Ltd',
          lastPrice: 1567.80,
          change: -12.50,
          pChange: -0.79,
          open: 1580.00,
          dayHigh: 1585.00,
          dayLow: 1565.00,
          previousClose: 1580.30,
          totalTradedVolume: 5678901,
          yearHigh: 1750.00,
          yearLow: 1400.00
        },
        {
          symbol: 'INFY',
          identifier: 'Infosys Ltd',
          lastPrice: 1456.25,
          change: 18.75,
          pChange: 1.30,
          open: 1440.00,
          dayHigh: 1460.00,
          dayLow: 1438.00,
          previousClose: 1437.50,
          totalTradedVolume: 4567890,
          yearHigh: 1650.00,
          yearLow: 1250.00
        },
        {
          symbol: 'HINDUNILVR',
          identifier: 'Hindustan Unilever Ltd',
          lastPrice: 2345.60,
          change: 8.90,
          pChange: 0.38,
          open: 2338.00,
          dayHigh: 2350.00,
          dayLow: 2335.00,
          previousClose: 2336.70,
          totalTradedVolume: 1234567,
          yearHigh: 2650.00,
          yearLow: 2100.00
        },
        {
          symbol: 'ICICIBANK',
          identifier: 'ICICI Bank Ltd',
          lastPrice: 987.45,
          change: 5.60,
          pChange: 0.57,
          open: 982.00,
          dayHigh: 990.00,
          dayLow: 980.00,
          previousClose: 981.85,
          totalTradedVolume: 6789012,
          yearHigh: 1100.00,
          yearLow: 850.00
        },
        {
          symbol: 'SBIN',
          identifier: 'State Bank of India',
          lastPrice: 567.80,
          change: -3.20,
          pChange: -0.56,
          open: 571.00,
          dayHigh: 572.00,
          dayLow: 566.00,
          previousClose: 571.00,
          totalTradedVolume: 9876543,
          yearHigh: 650.00,
          yearLow: 480.00
        },
        {
          symbol: 'BHARTIARTL',
          identifier: 'Bharti Airtel Ltd',
          lastPrice: 876.90,
          change: 12.40,
          pChange: 1.43,
          open: 865.00,
          dayHigh: 880.00,
          dayLow: 863.00,
          previousClose: 864.50,
          totalTradedVolume: 3456789,
          yearHigh: 950.00,
          yearLow: 700.00
        },
        {
          symbol: 'ITC',
          identifier: 'ITC Ltd',
          lastPrice: 432.15,
          change: 2.85,
          pChange: 0.66,
          open: 430.00,
          dayHigh: 434.00,
          dayLow: 429.00,
          previousClose: 429.30,
          totalTradedVolume: 7890123,
          yearHigh: 480.00,
          yearLow: 380.00
        },
        {
          symbol: 'KOTAKBANK',
          identifier: 'Kotak Mahindra Bank Ltd',
          lastPrice: 1789.50,
          change: -8.30,
          pChange: -0.46,
          open: 1798.00,
          dayHigh: 1800.00,
          dayLow: 1785.00,
          previousClose: 1797.80,
          totalTradedVolume: 2345678,
          yearHigh: 2000.00,
          yearLow: 1600.00
        }
      ]
    };
  }

  getDemoAllStocks() {
    // Return popular stocks as a subset of all stocks for demo
    return this.getDemoPopularStocks();
  }
}

module.exports = new IndianMarketService();
