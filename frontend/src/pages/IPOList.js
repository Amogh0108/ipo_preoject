import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ipoAPI } from '../services/api';
import toast from 'react-hot-toast';

const IPOList = () => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchIPOs();
  }, [filter, search]);

  const fetchIPOs = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (search) params.search = search;

      const response = await ipoAPI.getAll(params);
      setIpos(response.data.data);
    } catch (error) {
      toast.error('Failed to load IPOs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">IPO Listings</h1>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search IPOs..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All IPOs</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ipos.map((ipo) => (
          <div key={ipo._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {ipo.companyName}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">{ipo.symbol}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  ipo.status === 'active' ? 'bg-green-100 text-green-800' :
                  ipo.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ipo.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price Range:</span>
                  <span className="font-semibold">₹{ipo.priceRange.min} - ₹{ipo.priceRange.max}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Lot Size:</span>
                  <span className="font-semibold">{ipo.lotSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Open Date:</span>
                  <span className="font-semibold">{formatDate(ipo.openDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Close Date:</span>
                  <span className="font-semibold">{formatDate(ipo.closeDate)}</span>
                </div>
              </div>

              <Link
                to={`/ipos/${ipo._id}`}
                className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {ipos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No IPOs found</p>
        </div>
      )}
    </div>
  );
};

export default IPOList;
