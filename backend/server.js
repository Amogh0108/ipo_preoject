require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/authRoutes');
const ipoRoutes = require('./routes/ipoRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const marketDataRoutes = require('./routes/marketDataRoutes');
const adminRoutes = require('./routes/adminRoutes');
const indianMarketRoutes = require('./routes/indianMarketRoutes');
const ipoDataService = require('./services/ipoDataService');

const app = express();

// Connect to database
connectDB();

// Auto-sync IPO data on startup (after DB connection)
setTimeout(() => {
  ipoDataService.autoSync();
}, 2000);

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ipos', ipoRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/market-data', marketDataRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/indian-market', indianMarketRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Public endpoint to trigger IPO data sync (for demo purposes)
app.post('/api/sync-demo-ipos', async (req, res) => {
  try {
    const result = await ipoDataService.syncIPOData();
    res.json({
      success: true,
      message: 'Demo IPO data loaded successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load demo data',
      error: error.message
    });
  }
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;
