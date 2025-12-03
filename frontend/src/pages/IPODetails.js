import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ipoAPI, applicationAPI } from '../services/api';
import toast from 'react-hot-toast';

const IPODetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ipo, setIpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [formData, setFormData] = useState({ quantity: 1, bidPrice: 0 });

  useEffect(() => {
    fetchIPO();
  }, [id]);

  const fetchIPO = async () => {
    try {
      const response = await ipoAPI.getById(id);
      setIpo(response.data.data);
      setFormData({ ...formData, bidPrice: response.data.data.priceRange.min });
    } catch (error) {
      toast.error('Failed to load IPO details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      await applicationAPI.create({
        ipoId: id,
        quantity: parseInt(formData.quantity),
        bidPrice: parseFloat(formData.bidPrice)
      });
      toast.success('Application submitted successfully!');
      navigate('/applications');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!ipo) {
    return <div className="text-center py-12">IPO not found</div>;
  }

  const totalAmount = formData.quantity * formData.bidPrice;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {ipo.companyName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">{ipo.symbol}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            ipo.status === 'active' ? 'bg-green-100 text-green-800' :
            ipo.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {ipo.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price Range</h3>
            <p className="text-xl font-semibold">₹{ipo.priceRange.min} - ₹{ipo.priceRange.max}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Lot Size</h3>
            <p className="text-xl font-semibold">{ipo.lotSize} shares</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Min Investment</h3>
            <p className="text-xl font-semibold">₹{ipo.minInvestment}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Shares</h3>
            <p className="text-xl font-semibold">{ipo.totalShares.toLocaleString()}</p>
          </div>
        </div>

        {ipo.description && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-600 dark:text-gray-400">{ipo.description}</p>
          </div>
        )}

        {ipo.status === 'active' && (
          <form onSubmit={handleApply} className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Apply for IPO</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quantity (Lots)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bid Price (₹)</label>
                <input
                  type="number"
                  min={ipo.priceRange.min}
                  max={ipo.priceRange.max}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.bidPrice}
                  onChange={(e) => setFormData({ ...formData, bidPrice: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <p className="text-lg">
                Total Amount: <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
              </p>
            </div>
            <button
              type="submit"
              disabled={applying}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default IPODetails;
