const express = require('express');
const db = require('../database/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// POST /api/leaves/apply
router.post('/apply', (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: 'Please provide all leave details (type, dates, reason).' });
    }

    const leave = db.createLeaveRequest(req.user.id, { type, startDate, endDate, reason });

    res.json({
      success: true,
      message: 'Leave request submitted successfully!',
      leave
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/leaves/my-requests
router.get('/my-requests', (req, res) => {
  try {
    const leaves = db.getLeaveRequests({ userId: req.user.id });
    const balance = db.getLeaveBalance(req.user.id);
    res.json({
      success: true,
      leaves,
      balance
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/leaves/team-requests (Manager & Admin)
router.get('/team-requests', authorizeRoles('manager', 'admin'), (req, res) => {
  try {
    const department = req.user.role === 'manager' ? req.user.department : req.query.department;
    const { status } = req.query;
    const leaves = db.getLeaveRequests({ department, status });
    res.json({
      success: true,
      leaves
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/leaves/all (Admin only)
router.get('/all', authorizeRoles('admin'), (req, res) => {
  try {
    const { department, status } = req.query;
    const leaves = db.getLeaveRequests({ department, status });
    res.json({
      success: true,
      leaves
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/leaves/:id/status (Manager & Admin)
router.patch('/:id/status', authorizeRoles('manager', 'admin'), (req, res) => {
  try {
    const { status, comment } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const leave = db.updateLeaveStatus(req.params.id, status, comment);
    res.json({
      success: true,
      message: `Leave request ${status} successfully.`,
      leave
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
