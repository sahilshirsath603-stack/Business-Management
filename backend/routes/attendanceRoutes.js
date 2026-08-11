const express = require('express');
const db = require('../database/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/attendance/clock-in
router.post('/clock-in', (req, res) => {
  try {
    const { notes } = req.body;
    const log = db.clockIn(req.user.id, notes);
    res.json({
      success: true,
      message: 'Clocked in successfully!',
      log
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/attendance/clock-out
router.post('/clock-out', (req, res) => {
  try {
    const log = db.clockOut(req.user.id);
    res.json({
      success: true,
      message: 'Clocked out successfully!',
      log
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/attendance/today
router.get('/today', (req, res) => {
  try {
    const log = db.getTodayAttendanceForUser(req.user.id);
    res.json({
      success: true,
      log: log || null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/attendance/my-logs
router.get('/my-logs', (req, res) => {
  try {
    const logs = db.getAttendanceLogs({ userId: req.user.id });
    res.json({
      success: true,
      logs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/attendance/team (Manager & Admin)
router.get('/team', authorizeRoles('manager', 'admin'), (req, res) => {
  try {
    const { date } = req.query;
    const department = req.user.role === 'manager' ? req.user.department : req.query.department;
    let logs = db.getAttendanceLogs({ department, date });
    if (req.user.role === 'manager') {
      logs = logs.filter(l => String(l.userId) !== String(req.user.id) && (l.userRole === 'employee' || !l.userRole));
    }
    res.json({
      success: true,
      logs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/attendance/all (Admin only)
router.get('/all', authorizeRoles('admin'), (req, res) => {
  try {
    const { department, date } = req.query;
    const logs = db.getAttendanceLogs({ department, date });
    res.json({
      success: true,
      logs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
