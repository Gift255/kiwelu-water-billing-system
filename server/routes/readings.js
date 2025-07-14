const express = require('express');
const { executeQuery, executeTransaction, logger } = require('../config/database');
const { authenticateToken, checkPermission } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { sendSMS } = require('../services/smsService');
const router = express.Router();

// Get all meter readings
router.get('/', authenticateToken, checkPermission(['readings', 'approve_readings', 'all']), async (req, res) => {
  try {
    const { zone, status, period } = req.query;
    
    let query = `
      SELECT mr.*, c.name as customer_name, c.phone, m.meter_number, z.name as zone_name,
             u1.name as collector_name, u2.name as approved_by_name
      FROM meter_readings mr
      JOIN customers c ON mr.customer_id = c.id
      JOIN meters m ON mr.meter_id = m.id
      JOIN zones z ON c.zone_id = z.id
      JOIN users u1 ON mr.collector_id = u1.id
      LEFT JOIN users u2 ON mr.approved_by = u2.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (zone && zone !== 'all') {
      query += ' AND z.name = ?';
      params.push(zone);
    }
    
    if (status && status !== 'all') {
      query += ' AND mr.status = ?';
      params.push(status);
    }
    
    if (period && period !== 'all') {
      // Add date filtering based on period
      const currentDate = new Date();
      if (period === 'current') {
        query += ' AND YEAR(mr.reading_date) = ? AND MONTH(mr.reading_date) = ?';
        params.push(currentDate.getFullYear(), currentDate.getMonth() + 1);
      }
    }
    
    query += ' ORDER BY mr.reading_date DESC';
    
    const readings = await executeQuery(query, params);
    res.json(readings);
  } catch (error) {
    logger.error('Get readings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create meter reading
router.post('/', authenticateToken, checkPermission(['readings', 'all']), validate('createReading'), async (req, res) => {
  try {
    const { meter_id, customer_id, current_reading, reading_date, notes, photo_url, gps_location } = req.body;

    // Get previous reading
    const previousReadings = await executeQuery(
      'SELECT current_reading FROM meter_readings WHERE meter_id = ? ORDER BY reading_date DESC LIMIT 1',
      [meter_id]
    );
    
    const previous_reading = previousReadings.length > 0 ? previousReadings[0].current_reading : 0;

    // Validate reading
    if (current_reading < previous_reading) {
      return res.status(400).json({ error: 'Current reading cannot be less than previous reading' });
    }

    // Generate reading ID
    const readingId = `R${Date.now()}`;

    await executeQuery(
      `INSERT INTO meter_readings 
       (id, meter_id, customer_id, previous_reading, current_reading, reading_date, collector_id, notes, photo_url, gps_location) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [readingId, meter_id, customer_id, previous_reading, current_reading, reading_date, req.user.id, notes, photo_url, gps_location]
    );

    // Get created reading with customer info
    const newReading = await executeQuery(
      `SELECT mr.*, c.name as customer_name, m.meter_number, z.name as zone_name
       FROM meter_readings mr
       JOIN customers c ON mr.customer_id = c.id
       JOIN meters m ON mr.meter_id = m.id
       JOIN zones z ON c.zone_id = z.id
       WHERE mr.id = ?`,
      [readingId]
    );

    res.status(201).json(newReading[0]);
    logger.info(`Reading created for customer ${customer_id} by ${req.user.email}`);
  } catch (error) {
    logger.error('Create reading error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/reject meter reading
router.put('/:id/approve', authenticateToken, checkPermission(['approve_readings', 'all']), validate('approveReading'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    // Check if reading exists
    const existingReading = await executeQuery(
      `SELECT mr.*, c.name as customer_name, c.phone, u.name as collector_name, u.phone as collector_phone
       FROM meter_readings mr
       JOIN customers c ON mr.customer_id = c.id
       JOIN users u ON mr.collector_id = u.id
       WHERE mr.id = ?`,
      [id]
    );

    if (existingReading.length === 0) {
      return res.status(404).json({ error: 'Reading not found' });
    }

    const reading = existingReading[0];

    // Update reading status
    await executeQuery(
      'UPDATE meter_readings SET status = ?, approved_by = ?, approved_date = CURDATE(), rejection_reason = ? WHERE id = ?',
      [status, req.user.id, rejection_reason || null, id]
    );

    // Send SMS notification to meter reader
    const message = status === 'approved' 
      ? `Your meter reading for ${reading.customer_name} (${reading.current_reading} m³) has been approved by ${req.user.name}.`
      : `Your meter reading for ${reading.customer_name} has been rejected by ${req.user.name}. Reason: ${rejection_reason}`;

    try {
      await sendSMS(reading.collector_phone || '+255712000003', message, 'reading_confirmation');
    } catch (smsError) {
      logger.error('SMS notification failed:', smsError);
    }

    // Get updated reading
    const updatedReading = await executeQuery(
      `SELECT mr.*, c.name as customer_name, m.meter_number, z.name as zone_name, u.name as approved_by_name
       FROM meter_readings mr
       JOIN customers c ON mr.customer_id = c.id
       JOIN meters m ON mr.meter_id = m.id
       JOIN zones z ON c.zone_id = z.id
       LEFT JOIN users u ON mr.approved_by = u.id
       WHERE mr.id = ?`,
      [id]
    );

    res.json(updatedReading[0]);
    logger.info(`Reading ${id} ${status} by ${req.user.email}`);
  } catch (error) {
    logger.error('Approve reading error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get reading statistics
router.get('/stats/summary', authenticateToken, checkPermission(['readings', 'approve_readings', 'all']), async (req, res) => {
  try {
    const stats = await executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'flagged' THEN 1 ELSE 0 END) as flagged
      FROM meter_readings
    `);

    res.json(stats[0]);
  } catch (error) {
    logger.error('Get reading stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;