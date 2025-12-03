import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ipoAPI, applicationAPI, transactionAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeIPOs: 0,
    myApplications: 0,
    totalTransactions: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [activeIPOs, applications, transactions] = await Promise.all([
        ipoAPI.getActive(),
        applicationAPI.getMyApplications({ limit: 5 }),
        transactionAPI.getMyTransactions({ limit: 5 })
      ]);

      setStats({
        activeIPOs: activeIPOs.data.data.length,
        myApplications: applications.data.pagination.total,
        totalTransactions: transactions.data.pagination.total
      });

      setRecentApplications(applications.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active IPOs</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats.activeIPOs}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">My Applications</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.myApplications}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Transactions</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalTransactions}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
        </div>
        <div className="p-6">
          {recentApplications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No applications yet</p>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app._id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {app.ipo?.companyName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {app.quantity} | Amount: ₹{app.totalAmount}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    app.status === 'allotted' ? 'bg-green-100 text-green-800' :
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6">
            <Link to="/applications" className="text-primary-600 hover:text-primary-700 font-medium">
              View all applications →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
