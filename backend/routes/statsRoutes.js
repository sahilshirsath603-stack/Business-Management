const express = require('express');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// GET /api/stats/dashboard
router.get('/dashboard', (req, res) => {
  try {
    const stats = db.getStats(req.user);
    res.json({
      success: true,
      stats
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
