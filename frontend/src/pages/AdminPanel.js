import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const handleSyncIPOs = async () => {
    setSyncing(true);
    try {
      const response = await axios.post('http://localhost:5000/api/sync-demo-ipos');
      setSyncResult(response.data.data);
      toast.success(`Successfully synced ${response.data.data.total} IPOs!`);
    } catch (error) {
      toast.error('Failed to sync IPO data');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Panel</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">IPO Data Management</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Sync IPO data from external APIs or load demo data for testing.
        </p>
        
        <button
          onClick={handleSyncIPOs}
          disabled={syncing}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {syncing ? 'Syncing...' : 'Sync IPO Data'}
        </button>

        {syncResult && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Sync Results:</h3>
            <ul className="text-green-700 dark:text-green-300">
              <li>✅ Total IPOs: {syncResult.total}</li>
              <li>✅ Created: {syncResult.created}</li>
              <li>✅ Updated: {syncResult.updated}</li>
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h3 className="text-sm text-blue-600 dark:text-blue-300 mb-1">Active IPOs</h3>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {syncResult ? syncResult.total : '-'}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <h3 className="text-sm text-green-600 dark:text-green-300 mb-1">Last Sync</h3>
            <p className="text-2xl font-bold text-green-800 dark:text-green-200">
              {syncResult ? 'Just now' : 'Never'}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
            <h3 className="text-sm text-purple-600 dark:text-purple-300 mb-1">Auto-Sync</h3>
            <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              Enabled
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">ℹ️ Note:</h3>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          The system automatically syncs IPO data every 24 hours. You can manually trigger a sync using the button above.
          Currently using demo data. To use real data, add your Finnhub API key to the .env file.
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;
