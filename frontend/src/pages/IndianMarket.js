import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const IndianMarket = () => {
  const [indices, setIndices] = useState([]);
  const [popularStocks, setPopularStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [indicesRes, popularRes] = await Promise.all([
        axios.get('http://localhost:5000/api/indian-market/indices'),
        axios.get('http://localhost:5000/api/indian-market/popular')
      ]);

      if (indicesRes.data.success) {
        setIndices(indicesRes.data.data.data || []);
      }

      if (popularRes.data.success) {
        setPopularStocks(popularRes.data.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to load market data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/indian-market/search?q=${searchQuery}`
      );

      if (response.data.success) {
        setSearchResults(response.data.data.data || []);
        if (response.data.data.data.length === 0) {
          toast.info('No stocks found');
        }
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const viewStockDetails = async (symbol) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/indian-market/price/${symbol}`
      );

      if (response.data.success && response.data.data.data) {
        setSelectedStock(response.data.data.data[0]);
      }
    } catch (error) {
      toast.error('Failed to load stock details');
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatPrice = (price) => {
    if (!price) return '₹0.00';
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading Indian Market Data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        🇮🇳 Indian Stock Market
      </h1>

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search Indian stocks (e.g., RELIANCE, TCS, INFY)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((stock, index) => (
              <div
                key={index}
                onClick={() => viewStockDetails(stock.symbol)}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <h3 className="font-bold text-lg">{stock.symbol}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stock.identifier}</p>
                <p className="text-xl font-semibold mt-2">{formatPrice(stock.lastPrice)}</p>
                <p className={`text-sm ${stock.pChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.pChange >= 0 ? '▲' : '▼'} {Math.abs(stock.pChange || 0).toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Stock Details */}
      {selectedStock && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{selectedStock.symbol}</h2>
              <p className="text-gray-600 dark:text-gray-400">{selectedStock.identifier}</p>
            </div>
            <button
              onClick={() => setSelectedStock(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Last Price</p>
              <p className="text-2xl font-bold">{formatPrice(selectedStock.lastPrice)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Change</p>
              <p className={`text-xl font-semibold ${selectedStock.pChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedStock.pChange >= 0 ? '+' : ''}{selectedStock.pChange?.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Open</p>
              <p className="text-xl font-semibold">{formatPrice(selectedStock.open)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Previous Close</p>
              <p className="text-xl font-semibold">{formatPrice(selectedStock.previousClose)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Day High</p>
              <p className="text-xl font-semibold text-green-600">{formatPrice(selectedStock.dayHigh)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Day Low</p>
              <p className="text-xl font-semibold text-red-600">{formatPrice(selectedStock.dayLow)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Volume</p>
              <p className="text-xl font-semibold">{formatNumber(selectedStock.totalTradedVolume)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">52W High</p>
              <p className="text-xl font-semibold">{formatPrice(selectedStock.yearHigh)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Major Indices */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Major Indices</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {indices.map((index, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">{index.identifier || index.symbol}</h3>
              <p className="text-3xl font-bold mb-2">{formatPrice(index.lastPrice)}</p>
              <p className={`text-lg ${index.pChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {index.pChange >= 0 ? '▲' : '▼'} {Math.abs(index.pChange || 0).toFixed(2)}%
                <span className="text-sm ml-2">
                  ({index.change >= 0 ? '+' : ''}{index.change?.toFixed(2)})
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Stocks */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Popular Stocks</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Change
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Volume
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {popularStocks.map((stock, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {stock.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {stock.identifier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                    {formatPrice(stock.lastPrice)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right font-semibold ${
                    stock.pChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.pChange >= 0 ? '▲' : '▼'} {Math.abs(stock.pChange || 0).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {formatNumber(stock.totalTradedVolume)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => viewStockDetails(stock.symbol)}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          📊 Real-time Indian Market Data
        </h3>
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          Powered by RapidAPI - Latest Stock Price API. Data includes NSE stocks, major indices (NIFTY 50, SENSEX, NIFTY BANK), and real-time prices.
        </p>
      </div>
    </div>
  );
};

export default IndianMarket;
