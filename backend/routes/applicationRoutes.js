const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getApplicationById,
  getAllApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const { ipoApplicationValidation, validate } = require('../middleware/validator');

router.use(protect);

router.post('/', ipoApplicationValidation, validate, createApplication);
router.get('/my-applications', getMyApplications);
router.get('/:id', getApplicationById);

router.use(authorize('admin'));
router.get('/', getAllApplications);
router.put('/:id/status', updateApplicationStatus);

module.exports = router;
