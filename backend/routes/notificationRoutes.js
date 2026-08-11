const express = require('express');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// GET /api/notifications
router.get('/', (req, res) => {
  try {
    const notifications = db.getUserNotifications(req.user.id);
    res.json({
      success: true,
      notifications
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', (req, res) => {
  try {
    const notif = db.markNotificationAsRead(req.params.id, req.user.id);
    res.json({
      success: true,
      notification: notif
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
