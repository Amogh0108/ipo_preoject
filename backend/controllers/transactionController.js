const Transaction = require('../models/Transaction');

exports.getMyTransactions = async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user.id };

    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(query)
      .populate('application')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('user', 'name email')
      .populate('application');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(query)
      .populate('user', 'name email')
      .populate('application')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};
