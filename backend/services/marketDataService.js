const axios = require('axios');

class MarketDataService {
  constructor() {
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
    this.finnhubKey = process.env.FINNHUB_API_KEY;
    this.polygonKey = process.env.POLYGON_API_KEY;
  }

  // Alpha Vantage - Stock Quote
  async getStockQuote(symbol) {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageKey}`
      );
      return {
        source: 'AlphaVantage',
        data: response.data['Global Quote']
      };
    } catch (error) {
      console.error('Alpha Vantage API Error:', error.message);
      return null;
    }
  }

  // Finnhub - Company Profile
  async getCompanyProfile(symbol) {
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${this.finnhubKey}`
      );
      return {
        source: 'Finnhub',
        data: response.data
      };
    } catch (error) {
      console.error('Finnhub API Error:', error.message);
      return null;
    }
  }

  // Polygon - Market Status
  async getMarketStatus() {
    try {
      const response = await axios.get(
        `https://api.polygon.io/v1/marketstatus/now?apiKey=${this.polygonKey}`
      );
      return {
        source: 'Polygon',
        data: response.data
      };
    } catch (error) {
      console.error('Polygon API Error:', error.message);
      return null;
    }
  }

  // Finnhub - IPO Calendar
  async getIPOCalendar(from, to) {
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/calendar/ipo?from=${from}&to=${to}&token=${this.finnhubKey}`
      );
      return {
        source: 'Finnhub',
        data: response.data
      };
    } catch (error) {
      console.error('Finnhub IPO Calendar Error:', error.message);
      return null;
    }
  }

  // Aggregate data from all sources
  async getAggregatedMarketData(symbol) {
    const [quote, profile, marketStatus] = await Promise.all([
      this.getStockQuote(symbol),
      this.getCompanyProfile(symbol),
      this.getMarketStatus()
    ]);

    return {
      quote,
      profile,
      marketStatus,
      timestamp: new Date()
    };
  }
}

module.exports = new MarketDataService();
