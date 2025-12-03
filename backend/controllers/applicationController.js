const Application = require('../models/Application');
const IPO = require('../models/IPO');
const Transaction = require('../models/Transaction');

exports.createApplication = async (req, res, next) => {
  try {
    const { ipoId, quantity, bidPrice } = req.body;

    const ipo = await IPO.findById(ipoId);
    if (!ipo) {
      return res.status(404).json({ success: false, message: 'IPO not found' });
    }

    if (ipo.status !== 'active') {
      return res.status(400).json({ success: false, message: 'IPO is not active' });
    }

    const existingApplication = await Application.findOne({
      user: req.user.id,
      ipo: ipoId
    });

    if (existingApplication) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already applied for this IPO' 
      });
    }

    const totalAmount = quantity * bidPrice;

    const application = await Application.create({
      user: req.user.id,
      ipo: ipoId,
      quantity,
      bidPrice,
      totalAmount
    });

    await Transaction.create({
      user: req.user.id,
      application: application._id,
      type: 'application',
      amount: totalAmount,
      status: 'completed'
    });

    const populatedApplication = await Application.findById(application._id)
      .populate('ipo', 'companyName symbol');

    res.status(201).json({ success: true, data: populatedApplication });
  } catch (error) {
    next(error);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user.id };

    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const applications = await Application.find(query)
      .populate('ipo', 'companyName symbol status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      data: applications,
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

exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('ipo', 'companyName symbol priceRange status')
      .populate('user', 'name email');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.getAllApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const applications = await Application.find(query)
      .populate('user', 'name email')
      .populate('ipo', 'companyName symbol')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      data: applications,
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

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, allottedQuantity } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, allottedQuantity },
      { new: true, runValidators: true }
    ).populate('ipo', 'companyName symbol');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (status === 'allotted' && allottedQuantity > 0) {
      await Transaction.create({
        user: application.user,
        application: application._id,
        type: 'allotment',
        amount: allottedQuantity * application.bidPrice,
        status: 'completed'
      });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};
