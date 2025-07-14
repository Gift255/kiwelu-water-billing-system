const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await executeQuery(
      'SELECT id, name, email, role, status FROM users WHERE id = ? AND status = "active"',
      [decoded.userId]
    );

    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    req.user = user[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Check user permissions
const checkPermission = (requiredPermissions) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    const permissions = {
      admin: ['all'],
      accountant: ['billing', 'payments', 'invoices', 'reports', 'customers_view', 'approve_readings'],
      meter_reader: ['readings', 'customers_view']
    };
    
    const userPermissions = permissions[userRole] || [];
    
    const hasPermission = userPermissions.includes('all') || 
                         requiredPermissions.some(perm => userPermissions.includes(perm));
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

module.exports = {
  authenticateToken,
  checkPermission,
  generateToken
};