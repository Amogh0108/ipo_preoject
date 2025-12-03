const IPO = require('../models/IPO');

exports.getAllIPOs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { symbol: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const ipos = await IPO.find(query)
      .sort({ openDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await IPO.countDocuments(query);

    res.json({
      success: true,
      data: ipos,
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

exports.getIPOById = async (req, res, next) => {
  try {
    const ipo = await IPO.findById(req.params.id);

    if (!ipo) {
      return res.status(404).json({ success: false, message: 'IPO not found' });
    }

    res.json({ success: true, data: ipo });
  } catch (error) {
    next(error);
  }
};

exports.createIPO = async (req, res, next) => {
  try {
    const ipo = await IPO.create(req.body);
    res.status(201).json({ success: true, data: ipo });
  } catch (error) {
    next(error);
  }
};

exports.updateIPO = async (req, res, next) => {
  try {
    const ipo = await IPO.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!ipo) {
      return res.status(404).json({ success: false, message: 'IPO not found' });
    }

    res.json({ success: true, data: ipo });
  } catch (error) {
    next(error);
  }
};

exports.deleteIPO = async (req, res, next) => {
  try {
    const ipo = await IPO.findByIdAndDelete(req.params.id);

    if (!ipo) {
      return res.status(404).json({ success: false, message: 'IPO not found' });
    }

    res.json({ success: true, message: 'IPO deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getActiveIPOs = async (req, res, next) => {
  try {
    const now = new Date();
    const ipos = await IPO.find({
      openDate: { $lte: now },
      closeDate: { $gte: now },
      status: 'active'
    }).sort({ openDate: -1 });

    res.json({ success: true, data: ipos });
  } catch (error) {
    next(error);
  }
};

exports.getUpcomingIPOs = async (req, res, next) => {
  try {
    const now = new Date();
    const ipos = await IPO.find({
      openDate: { $gt: now },
      status: 'upcoming'
    }).sort({ openDate: 1 });

    res.json({ success: true, data: ipos });
  } catch (error) {
    next(error);
  }
};
