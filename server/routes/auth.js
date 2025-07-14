const express = require('express');
const bcrypt = require('bcryptjs');
const { executeQuery, logger } = require('../config/database');
const { generateToken, authenticateToken } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const router = express.Router();

// Login
router.post('/login', validate('login'), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user from database
    const users = await executeQuery(
      'SELECT id, name, email, password_hash, role, status FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await executeQuery(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password)
    const { password_hash, ...userData } = user;
    
    res.json({
      token,
      user: userData
    });

    logger.info(`User ${email} logged in successfully`);
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await executeQuery(
      'SELECT id, name, email, role, phone, status, created_at, last_login FROM users WHERE id = ?',
      [req.user.id]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user[0]);
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (client-side token removal, but we can log it)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    logger.info(`User ${req.user.email} logged out`);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;