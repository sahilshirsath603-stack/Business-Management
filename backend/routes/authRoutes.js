const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register (Self-Registration Request)
router.post('/register', (req, res) => {
  try {
    const { name, email, password, role, department, designation } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ success: false, message: 'Name, email, password, and department are required.' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const user = db.registerUser({ name, email, password, role, department, designation });

    const approverTitle = user.role === 'manager' ? 'Super Admin' : `${department} Department Manager`;

    res.status(201).json({
      success: true,
      message: `Registration request submitted! Your account access is pending approval by the ${approverTitle}.`,
      user
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid ID and password.' });
    }

    // Strict portal role validation
    const { requiredRole } = req.body;
    if (requiredRole && user.role !== requiredRole) {
      const targetTitle = requiredRole === 'employee' ? 'Employee Portal' : requiredRole === 'manager' ? 'Manager Console' : 'Admin Portal';
      const actualTitle = user.role === 'employee' ? 'Employee Portal' : user.role === 'manager' ? 'Manager Console' : 'Admin Portal';
      return res.status(403).json({
        success: false,
        message: `Access Denied: You cannot log into the ${targetTitle} with a ${user.role.toUpperCase()} account. Please select the ${actualTitle}.`
      });
    }

    if (user.status === 'pending_approval') {
      const approverTitle = user.role === 'manager' ? 'Super Admin' : 'Department Manager';
      return res.status(403).json({
        success: false,
        message: `Account access request is pending approval by your ${approverTitle}. You will be able to log in once approved.`
      });
    }

    if (user.status === 'deactivated' || user.status === 'rejected') {
      return res.status(403).json({ success: false, message: 'Account is inactive or has been declined. Contact Administrator.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid ID and password.' });
    }

    // Generate JWT Token (24h validity)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userPayload } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userPayload
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
