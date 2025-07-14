const express = require('express');
const { executeQuery, logger } = require('../config/database');
const { authenticateToken, checkPermission } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const router = express.Router();

// Get all customers
router.get('/', authenticateToken, checkPermission(['customers_view', 'all']), async (req, res) => {
  try {
    const { zone, status, search } = req.query;
    
    let query = `
      SELECT c.*, z.name as zone_name, m.meter_number,
             (SELECT reading_date FROM meter_readings mr WHERE mr.customer_id = c.id ORDER BY reading_date DESC LIMIT 1) as last_reading_date
      FROM customers c
      LEFT JOIN zones z ON c.zone_id = z.id
      LEFT JOIN meters m ON c.id = m.customer_id AND m.status = 'active'
      WHERE 1=1
    `;
    
    const params = [];
    
    if (zone && zone !== 'all') {
      query += ' AND z.name = ?';
      params.push(zone);
    }
    
    if (status && status !== 'all') {
      query += ' AND c.status = ?';
      params.push(status);
    }
    
    if (search) {
      query += ' AND (c.name LIKE ? OR c.phone LIKE ? OR c.email LIKE ? OR m.meter_number LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY c.created_at DESC';
    
    const customers = await executeQuery(query, params);
    res.json(customers);
  } catch (error) {
    logger.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer by ID
router.get('/:id', authenticateToken, checkPermission(['customers_view', 'all']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const customers = await executeQuery(
      `SELECT c.*, z.name as zone_name, m.meter_number
       FROM customers c
       LEFT JOIN zones z ON c.zone_id = z.id
       LEFT JOIN meters m ON c.id = m.customer_id AND m.status = 'active'
       WHERE c.id = ?`,
      [id]
    );

    if (customers.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customers[0]);
  } catch (error) {
    logger.error('Get customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create customer (admin only)
router.post('/', authenticateToken, checkPermission(['all']), validate('createCustomer'), async (req, res) => {
  try {
    const { name, phone, email, address, zone_id, connection_type } = req.body;

    // Generate customer ID
    const customerId = `C${Date.now()}`;
    
    // Generate meter ID and create meter
    const meterId = `M${Date.now()}`;
    const meterNumber = `M${String(Date.now()).slice(-6)}`;

    // Insert customer and meter in transaction
    const queries = [
      {
        query: 'INSERT INTO customers (id, name, phone, email, address, zone_id, connection_type, registration_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)',
        params: [customerId, name, phone, email || null, address, zone_id, connection_type || 'residential', req.user.id]
      },
      {
        query: 'INSERT INTO meters (id, meter_number, customer_id, installation_date) VALUES (?, ?, ?, CURDATE())',
        params: [meterId, meterNumber, customerId]
      }
    ];

    await executeTransaction(queries);

    // Get created customer with zone info
    const newCustomer = await executeQuery(
      `SELECT c.*, z.name as zone_name, m.meter_number
       FROM customers c
       LEFT JOIN zones z ON c.zone_id = z.id
       LEFT JOIN meters m ON c.id = m.customer_id
       WHERE c.id = ?`,
      [customerId]
    );

    res.status(201).json(newCustomer[0]);
    logger.info(`Customer ${name} created by ${req.user.email}`);
  } catch (error) {
    logger.error('Create customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer (admin only)
router.put('/:id', authenticateToken, checkPermission(['all']), validate('updateCustomer'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if customer exists
    const existingCustomer = await executeQuery(
      'SELECT id FROM customers WHERE id = ?',
      [id]
    );

    if (existingCustomer.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
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
      `UPDATE customers SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      updateValues
    );

    // Get updated customer
    const updatedCustomer = await executeQuery(
      `SELECT c.*, z.name as zone_name, m.meter_number
       FROM customers c
       LEFT JOIN zones z ON c.zone_id = z.id
       LEFT JOIN meters m ON c.id = m.customer_id AND m.status = 'active'
       WHERE c.id = ?`,
      [id]
    );

    res.json(updatedCustomer[0]);
    logger.info(`Customer ${id} updated by ${req.user.email}`);
  } catch (error) {
    logger.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete customer (admin only)
router.delete('/:id', authenticateToken, checkPermission(['all']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if customer exists
    const existingCustomer = await executeQuery(
      'SELECT id, name FROM customers WHERE id = ?',
      [id]
    );

    if (existingCustomer.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await executeQuery('DELETE FROM customers WHERE id = ?', [id]);

    res.json({ message: 'Customer deleted successfully' });
    logger.info(`Customer ${existingCustomer[0].name} deleted by ${req.user.email}`);
  } catch (error) {
    logger.error('Delete customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer statistics
router.get('/stats/summary', authenticateToken, checkPermission(['customers_view', 'all']), async (req, res) => {
  try {
    const stats = await executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive
      FROM customers
    `);

    res.json(stats[0]);
  } catch (error) {
    logger.error('Get customer stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;