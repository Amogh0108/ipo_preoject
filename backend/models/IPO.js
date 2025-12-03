const mongoose = require('mongoose');

const ipoSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  lotSize: {
    type: Number,
    required: true
  },
  openDate: {
    type: Date,
    required: true
  },
  closeDate: {
    type: Date,
    required: true
  },
  listingDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'closed', 'listed'],
    default: 'upcoming'
  },
  totalShares: {
    type: Number,
    required: true
  },
  minInvestment: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  sector: {
    type: String
  }
}, {
  timestamps: true
});

ipoSchema.index({ symbol: 1 });
ipoSchema.index({ status: 1 });
ipoSchema.index({ openDate: 1, closeDate: 1 });

module.exports = mongoose.model('IPO', ipoSchema);
