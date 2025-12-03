const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IPO',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  bidPrice: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'allotted', 'not_allotted'],
    default: 'pending'
  },
  allottedQuantity: {
    type: Number,
    default: 0
  },
  applicationNumber: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

applicationSchema.index({ user: 1, ipo: 1 });
applicationSchema.index({ applicationNumber: 1 });
applicationSchema.index({ status: 1 });

applicationSchema.pre('save', function(next) {
  if (!this.applicationNumber) {
    this.applicationNumber = `APP${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
