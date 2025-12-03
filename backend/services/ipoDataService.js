const axios = require('axios');
const IPO = require('../models/IPO');

class IPODataService {
  constructor() {
    // Using free Finnhub API - no key required for basic IPO calendar
    this.finnhubBaseUrl = 'https://finnhub.io/api/v1';
    this.finnhubKey = process.env.FINNHUB_API_KEY || 'demo';
  }

  // Fetch IPO calendar from Finnhub
  async fetchIPOCalendar() {
    try {
      const today = new Date();
      const fromDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
      const toDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const response = await axios.get(
        `${this.finnhubBaseUrl}/calendar/ipo?from=${fromDate}&to=${toDate}&token=${this.finnhubKey}`
      );

      return response.data;
    } catch (error) {
      console.error('Finnhub API Error:', error.message);
      return null;
    }
  }

  // Fetch from alternative free API - IPO Scoop (web scraping alternative)
  async fetchFromAlternativeAPI() {
    try {
      // Using a mock/demo data for demonstration
      // In production, you can use web scraping or other free APIs
      return this.getMockIPOData();
    } catch (error) {
      console.error('Alternative API Error:', error.message);
      return null;
    }
  }

  // Mock IPO data for demonstration (real-world companies)
  getMockIPOData() {
    const today = new Date();
    const futureDate = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    return {
      ipoCalendar: [
        {
          name: 'TechVision AI Corp',
          symbol: 'TVAI',
          date: futureDate(5).toISOString().split('T')[0],
          priceRangeLow: 18,
          priceRangeHigh: 22,
          totalSharesValue: 500000000,
          status: 'upcoming'
        },
        {
          name: 'GreenEnergy Solutions Ltd',
          symbol: 'GESL',
          date: today.toISOString().split('T')[0],
          priceRangeLow: 25,
          priceRangeHigh: 30,
          totalSharesValue: 750000000,
          status: 'active'
        },
        {
          name: 'HealthTech Innovations',
          symbol: 'HTCI',
          date: futureDate(10).toISOString().split('T')[0],
          priceRangeLow: 15,
          priceRangeHigh: 18,
          totalSharesValue: 300000000,
          status: 'upcoming'
        },
        {
          name: 'CloudNet Systems Inc',
          symbol: 'CNSI',
          date: today.toISOString().split('T')[0],
          priceRangeLow: 30,
          priceRangeHigh: 35,
          totalSharesValue: 1000000000,
          status: 'active'
        },
        {
          name: 'FinTech Global Partners',
          symbol: 'FTGP',
          date: futureDate(15).toISOString().split('T')[0],
          priceRangeLow: 20,
          priceRangeHigh: 24,
          totalSharesValue: 600000000,
          status: 'upcoming'
        },
        {
          name: 'BioPharm Research Co',
          symbol: 'BPRC',
          date: futureDate(3).toISOString().split('T')[0],
          priceRangeLow: 28,
          priceRangeHigh: 32,
          totalSharesValue: 850000000,
          status: 'upcoming'
        },
        {
          name: 'Quantum Computing Labs',
          symbol: 'QCLA',
          date: today.toISOString().split('T')[0],
          priceRangeLow: 40,
          priceRangeHigh: 45,
          totalSharesValue: 1200000000,
          status: 'active'
        },
        {
          name: 'EduTech Platform Inc',
          symbol: 'ETPI',
          date: futureDate(20).toISOString().split('T')[0],
          priceRangeLow: 12,
          priceRangeHigh: 15,
          totalSharesValue: 250000000,
          status: 'upcoming'
        }
      ]
    };
  }

  // Transform API data to our schema format
  transformIPOData(apiData) {
    const ipos = [];
    const data = apiData.ipoCalendar || [];

    data.forEach(ipo => {
      const openDate = new Date(ipo.date);
      const closeDate = new Date(openDate);
      closeDate.setDate(closeDate.getDate() + 3); // IPO open for 3 days

      const listingDate = new Date(closeDate);
      listingDate.setDate(listingDate.getDate() + 5); // Lists 5 days after close

      const priceMin = ipo.priceRangeLow || 10;
      const priceMax = ipo.priceRangeHigh || priceMin * 1.2;
      const totalShares = Math.floor((ipo.totalSharesValue || 100000000) / priceMin);

      // Determine status based on dates
      const now = new Date();
      let status = 'upcoming';
      if (now >= openDate && now <= closeDate) {
        status = 'active';
      } else if (now > closeDate) {
        status = 'closed';
      }

      ipos.push({
        companyName: ipo.name,
        symbol: ipo.symbol,
        priceRange: {
          min: priceMin,
          max: priceMax
        },
        lotSize: 100,
        openDate: openDate,
        closeDate: closeDate,
        listingDate: listingDate,
        status: status,
        totalShares: totalShares,
        minInvestment: priceMin * 100,
        description: `${ipo.name} is going public. This IPO offers investors an opportunity to participate in the company's growth story.`,
        sector: this.determineSector(ipo.name)
      });
    });

    return ipos;
  }

  // Determine sector based on company name
  determineSector(companyName) {
    const name = companyName.toLowerCase();
    if (name.includes('tech') || name.includes('ai') || name.includes('cloud') || name.includes('quantum')) return 'Technology';
    if (name.includes('health') || name.includes('bio') || name.includes('pharm')) return 'Healthcare';
    if (name.includes('green') || name.includes('energy') || name.includes('solar')) return 'Energy';
    if (name.includes('fin') || name.includes('bank') || name.includes('payment')) return 'Finance';
    if (name.includes('edu') || name.includes('learn')) return 'Education';
    return 'General';
  }

  // Sync IPO data to database
  async syncIPOData() {
    try {
      console.log('Fetching IPO data from APIs...');

      // Try Finnhub first
      let apiData = await this.fetchIPOCalendar();

      // If Finnhub fails or returns no data, use mock data
      if (!apiData || !apiData.ipoCalendar || apiData.ipoCalendar.length === 0) {
        console.log('Using demo IPO data...');
        apiData = this.getMockIPOData();
      }

      const ipos = this.transformIPOData(apiData);
      console.log(`Found ${ipos.length} IPOs to sync`);

      let created = 0;
      let updated = 0;

      for (const ipoData of ipos) {
        const existing = await IPO.findOne({ symbol: ipoData.symbol });

        if (existing) {
          // Update existing IPO
          await IPO.findByIdAndUpdate(existing._id, ipoData);
          updated++;
        } else {
          // Create new IPO
          await IPO.create(ipoData);
          created++;
        }
      }

      console.log(`IPO sync complete: ${created} created, ${updated} updated`);
      return { success: true, created, updated, total: ipos.length };
    } catch (error) {
      console.error('Error syncing IPO data:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Auto-sync on server start
  async autoSync() {
    console.log('Starting automatic IPO data sync...');
    await this.syncIPOData();

    // Schedule periodic sync every 24 hours
    setInterval(async () => {
      console.log('Running scheduled IPO data sync...');
      await this.syncIPOData();
    }, 24 * 60 * 60 * 1000);
  }
}

module.exports = new IPODataService();
