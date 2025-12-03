import React, { useState } from 'react';
import { marketDataAPI } from '../services/api';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MarketData = () => {
  const [symbol, setSymbol] = useState('');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMarketData = async (e) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    try {
      const response = await marketDataAPI.getAggregatedData(symbol);
      setMarketData(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Market Data</h1>

      <form onSubmit={fetchMarketData} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </form>

      {marketData && (
        <div className="space-y-6">
          {marketData.quote && marketData.quote.data && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Stock Quote</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Symbol</p>
                  <p className="text-lg font-semibold">{marketData.quote.data['01. symbol']}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-lg font-semibold">${marketData.quote.data['05. price']}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Change</p>
                  <p className={`text-lg font-semibold ${
                    parseFloat(marketData.quote.data['09. change']) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {marketData.quote.data['09. change']} ({marketData.quote.data['10. change percent']})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
                  <p className="text-lg font-semibold">{marketData.quote.data['06. volume']}</p>
                </div>
              </div>
            </div>
          )}

          {marketData.profile && marketData.profile.data && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Name:</span> {marketData.profile.data.name}</p>
                <p><span className="font-semibold">Country:</span> {marketData.profile.data.country}</p>
                <p><span className="font-semibold">Industry:</span> {marketData.profile.data.finnhubIndustry}</p>
                <p><span className="font-semibold">Market Cap:</span> ${marketData.profile.data.marketCapitalization}M</p>
              </div>
            </div>
          )}

          {marketData.marketStatus && marketData.marketStatus.data && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Market Status</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Market:</span> {marketData.marketStatus.data.market}</p>
                <p><span className="font-semibold">Status:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                    marketData.marketStatus.data.serverTime ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {marketData.marketStatus.data.serverTime ? 'Open' : 'Closed'}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {!marketData && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Enter a stock symbol to view real-time market data
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketData;
