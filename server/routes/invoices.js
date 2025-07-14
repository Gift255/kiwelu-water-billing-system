const express = require('express');
const { executeQuery, executeTransaction, logger } = require('../config/database');
const { authenticateToken, checkPermission } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { sendSMS } = require('../services/smsService');
const router = express.Router();

// Get all invoices
router.get('/', authenticateToken, checkPermission(['invoices', 'all']), async (req, res) => {
  try {
    const { status, payment_status, period } = req.query;
    
    let query = `
      SELECT i.*, c.name as customer_name, c.phone, z.name as zone_name
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      JOIN zones z ON c.zone_id = z.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (status && status !== 'all') {
      query += ' AND i.status = ?';
      params.push(status);
    }
    
    if (payment_status && payment_status !== 'all') {
      query += ' AND i.payment_status = ?';
      params.push(payment_status);
    }
    
    if (period && period !== 'all') {
      const currentDate = new Date();
      if (period === 'current') {
        query += ' AND YEAR(i.issue_date) = ? AND MONTH(i.issue_date) = ?';
        params.push(currentDate.getFullYear(), currentDate.getMonth() + 1);
      }
    }
    
    query += ' ORDER BY i.issue_date DESC';
    
    const invoices = await executeQuery(query, params);
    res.json(invoices);
  } catch (error) {
    logger.error('Get invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate invoices from approved readings
router.post('/generate', authenticateToken, checkPermission(['invoices', 'all']), async (req, res) => {
  try {
    const { zone_filter = 'all' } = req.body;

    // Get approved readings without invoices
    let query = `
      SELECT mr.*, c.name as customer_name, c.phone, c.connection_type, z.name as zone_name
      FROM meter_readings mr
      JOIN customers c ON mr.customer_id = c.id
      JOIN zones z ON c.zone_id = z.id
      WHERE mr.status = 'approved'
      AND NOT EXISTS (SELECT 1 FROM invoices i WHERE i.meter_reading_id = mr.id)
    `;
    
    const params = [];
    if (zone_filter !== 'all') {
      query += ' AND z.name = ?';
      params.push(zone_filter);
    }

    const readings = await executeQuery(query, params);

    if (readings.length === 0) {
      return res.json({ message: 'No approved readings found for invoice generation', count: 0 });
    }

    // Get billing rates
    const rates = await executeQuery(
      'SELECT * FROM billing_rates WHERE is_active = TRUE ORDER BY connection_type, min_consumption'
    );

    const invoices = [];
    const smsPromises = [];

    for (const reading of readings) {
      // Calculate bill amount based on consumption and connection type
      const consumption = reading.consumption;
      const connectionType = reading.connection_type;
      
      let totalAmount = 2000; // Base charge
      let remainingConsumption = consumption;
      
      // Apply tiered rates
      const applicableRates = rates.filter(r => r.connection_type === connectionType);
      
      for (const rate of applicableRates) {
        if (remainingConsumption <= 0) break;
        
        const tierConsumption = rate.max_consumption 
          ? Math.min(remainingConsumption, rate.max_consumption - rate.min_consumption)
          : remainingConsumption;
        
        if (consumption > rate.min_consumption) {
          const billableConsumption = Math.min(tierConsumption, consumption - rate.min_consumption);
          totalAmount += billableConsumption * rate.rate_per_unit;
          remainingConsumption -= billableConsumption;
        }
      }

      // Add tax (10%)
      const taxAmount = totalAmount * 0.1;
      totalAmount += taxAmount;

      // Generate invoice
      const invoiceId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const issueDate = new Date().toISOString().split('T')[0];
      const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      await executeQuery(
        `INSERT INTO invoices 
         (id, customer_id, meter_reading_id, billing_period_start, billing_period_end, consumption, 
          base_charge, consumption_charge, tax_amount, total_amount, issue_date, due_date, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          invoiceId, reading.customer_id, reading.id,
          new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
          consumption, 2000, totalAmount - 2000 - taxAmount, taxAmount, totalAmount,
          issueDate, dueDate, req.user.id
        ]
      );

      invoices.push({
        id: invoiceId,
        customer_name: reading.customer_name,
        amount: totalAmount
      });

      // Prepare SMS notification
      const message = `Your water invoice for ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} is TZS ${totalAmount.toLocaleString()}. Due date: ${dueDate}.`;
      
      smsPromises.push(
        sendSMS(reading.phone, message, 'billing').catch(error => {
          logger.error(`SMS failed for customer ${reading.customer_name}:`, error);
        })
      );
    }

    // Send all SMS notifications
    await Promise.allSettled(smsPromises);

    res.json({
      message: `${invoices.length} invoices generated successfully`,
      count: invoices.length,
      invoices: invoices
    });

    logger.info(`${invoices.length} invoices generated by ${req.user.email}`);
  } catch (error) {
    logger.error('Generate invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update invoice payment status
router.put('/:id/payment-status', authenticateToken, checkPermission(['invoices', 'all']), validate('updateInvoiceStatus'), async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    // Check if invoice exists
    const existingInvoice = await executeQuery(
      'SELECT i.*, c.name as customer_name, c.phone FROM invoices i JOIN customers c ON i.customer_id = c.id WHERE i.id = ?',
      [id]
    );

    if (existingInvoice.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoice = existingInvoice[0];

    // Update payment status
    await executeQuery(
      'UPDATE invoices SET payment_status = ?, updated_at = NOW() WHERE id = ?',
      [payment_status, id]
    );

    // Send SMS if status changed to paid
    if (payment_status === 'paid' && invoice.payment_status !== 'paid') {
      const message = `Payment confirmed for invoice ${id}. Amount: TZS ${invoice.total_amount.toLocaleString()}. Thank you!`;
      
      try {
        await sendSMS(invoice.phone, message, 'payment_confirmation');
      } catch (smsError) {
        logger.error('SMS notification failed:', smsError);
      }
    }

    // Get updated invoice
    const updatedInvoice = await executeQuery(
      'SELECT i.*, c.name as customer_name FROM invoices i JOIN customers c ON i.customer_id = c.id WHERE i.id = ?',
      [id]
    );

    res.json(updatedInvoice[0]);
    logger.info(`Invoice ${id} payment status updated to ${payment_status} by ${req.user.email}`);
  } catch (error) {
    logger.error('Update invoice status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get invoice statistics
router.get('/stats/summary', authenticateToken, checkPermission(['invoices', 'all']), async (req, res) => {
  try {
    const stats = await executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid,
        SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN payment_status = 'overdue' THEN 1 ELSE 0 END) as overdue,
        SUM(total_amount) as total_amount,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as paid_amount,
        SUM(CASE WHEN payment_status = 'pending' THEN total_amount ELSE 0 END) as pending_amount,
        SUM(CASE WHEN payment_status = 'overdue' THEN total_amount ELSE 0 END) as overdue_amount
      FROM invoices
    `);

    res.json(stats[0]);
  } catch (error) {
    logger.error('Get invoice stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;