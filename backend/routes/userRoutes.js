const express = require('express');
const db = require('../database/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// GET /api/users/pending-access (Manager & Admin)
router.get('/pending-access', authorizeRoles('manager', 'admin'), (req, res) => {
  try {
    const roleFilter = req.user.role === 'manager' ? 'employee' : req.query.role;
    const departmentFilter = req.user.role === 'manager' ? req.user.department : req.query.department;
    const pending = db.getPendingAccessRequests({ role: roleFilter, department: departmentFilter });
    res.json({
      success: true,
      pending
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/users/:id/access (Manager & Admin: Approve / Decline Access)
router.patch('/:id/access', authorizeRoles('manager', 'admin'), (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'decline'
    if (!['approve', 'decline'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid access action.' });
    }

    let resultUser;
    if (action === 'approve') {
      resultUser = db.approveAccess(req.params.id, req.user);
    } else {
      resultUser = db.declineAccess(req.params.id, req.user);
    }

    res.json({
      success: true,
      message: `Account access ${action === 'approve' ? 'approved' : 'declined'} successfully.`,
      user: resultUser
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/users (Manager & Admin)
router.get('/', authorizeRoles('manager', 'admin'), (req, res) => {
  try {
    let users = db.getAllUsers();
    if (req.user.role === 'manager') {
      users = users.filter(u => u.role === 'employee' && String(u.id) !== String(req.user.id) && (u.department === req.user.department || String(u.reportsTo) === String(req.user.id)));
    }
    res.json({
      success: true,
      users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin-Only Routes Below
router.use(authorizeRoles('admin'));

// POST /api/users
router.post('/', (req, res) => {
  try {
    const { name, email, password, role, department, designation, reportsTo, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
    }

    const user = db.createUser({ name, email, password, role, department, designation, reportsTo, status });
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/users/:id
router.put('/:id', (req, res) => {
  try {
    const updatedUser = db.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    db.deleteUser(req.params.id);
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
