const express = require('express');
const bcrypt = require('bcryptjs');
const { executeQuery, logger } = require('../config/database');
const { authenticateToken, checkPermission } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, checkPermission(['all']), async (req, res) => {
  try {
    const users = await executeQuery(
      'SELECT id, name, email, role, phone, status, created_at, last_login FROM users ORDER BY created_at DESC'
    );

    res.json(users);
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user (admin only)
router.post('/', authenticateToken, checkPermission(['all']), validate('createUser'), async (req, res) => {
  try {
    const { name, email, password, role, phone, status } = req.body;

    // Check if email already exists
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate user ID
    const userId = `U${Date.now()}`;

    // Insert user
    await executeQuery(
      'INSERT INTO users (id, name, email, password_hash, role, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, passwordHash, role, phone || null, status || 'active']
    );

    // Get created user (without password)
    const newUser = await executeQuery(
      'SELECT id, name, email, role, phone, status, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.status(201).json(newUser[0]);
    logger.info(`User ${email} created by ${req.user.email}`);
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (admin only)
router.put('/:id', authenticateToken, checkPermission(['all']), validate('updateUser'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if user exists
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateValues.push(id);

    await executeQuery(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      updateValues
    );

    // Get updated user
    const updatedUser = await executeQuery(
      'SELECT id, name, email, role, phone, status, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    res.json(updatedUser[0]);
    logger.info(`User ${id} updated by ${req.user.email}`);
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, checkPermission(['all']), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check if user exists
    const existingUser = await executeQuery(
      'SELECT id, email FROM users WHERE id = ?',
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await executeQuery('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'User deleted successfully' });
    logger.info(`User ${existingUser[0].email} deleted by ${req.user.email}`);
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;