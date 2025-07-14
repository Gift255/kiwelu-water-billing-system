const express = require('express');
const { executeQuery, executeTransaction, logger } = require('../config/database');
const { authenticateToken, checkPermission } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { sendSMS } = require('../services/smsService');
const router = express.Router();

// Get all payments
router.get('/', authenticateToken, checkPermission(['payments', 'all']), async (req, res) => {
  try {
    const { method, status, customer_id } = req.query;
    
    let query = `
      SELECT p.*, c.name as customer_name, c.phone, i.id as invoice_number, u.name as collector_name
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
      JOIN invoices i ON p.invoice_id = i.id
      JOIN users u ON p.collector_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (method && method !== 'all') {
      query += ' AND p.payment_method = ?';
      params.push(method);
    }
    
    if (status && status !== 'all') {
      query += ' AND p.status = ?';
      params.push(status);
    }
    
    if (customer_id) {
      query += ' AND p.customer_id = ?';
      params.push(customer_id);
    }
    
    query += ' ORDER BY p.payment_date DESC';
    
    const payments = await executeQuery(query, params);
    res.json(payments);
  } catch (error) {
    logger.error('Get payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create payment
router.post('/', authenticateToken, checkPermission(['payments', 'all']), validate('createPayment'), async (req, res) => {
  try {
    const { invoice_id, amount, payment_method, reference_number, payment_date, notes } = req.body;

    // Check if invoice exists
    const invoice = await executeQuery(
      'SELECT i.*, c.name as customer_name, c.phone FROM invoices i JOIN customers c ON i.customer_id = c.id WHERE i.id = ?',
      [invoice_id]
    );

    if (invoice.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoiceData = invoice[0];

    // Validate payment amount
    if (amount > invoiceData.total_amount) {
      return res.status(400).json({ error: 'Payment amount cannot exceed invoice amount' });
    }

    // Generate payment ID
    const paymentId = `PAY-${Date.now()}`;

    // Create payment and update invoice status in transaction
    const queries = [
      {
        query: `INSERT INTO payments 
                (id, invoice_id, customer_id, amount, payment_method, reference_number, payment_date, collector_id, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [paymentId, invoice_id, invoiceData.customer_id, amount, payment_method, reference_number, payment_date, req.user.id, notes]
      }
    ];

    // Update invoice payment status
    const totalPaid = await executeQuery(
      'SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE invoice_id = ? AND status = "confirmed"',
      [invoice_id]
    );

    const newTotal = parseFloat(totalPaid[0].total) + parseFloat(amount);
    let paymentStatus = 'partial';
    
    if (newTotal >= invoiceData.total_amount) {
      paymentStatus = 'paid';
    }

    queries.push({
      query: 'UPDATE invoices SET payment_status = ?, updated_at = NOW() WHERE id = ?',
      params: [paymentStatus, invoice_id]
    });

    // Update customer balance
    queries.push({
      query: 'UPDATE customers SET balance = balance + ?, updated_at = NOW() WHERE id = ?',
      params: [amount, invoiceData.customer_id]
    });

    await executeTransaction(queries);

    // Send SMS confirmation
    const message = `Payment of TZS ${parseFloat(amount).toLocaleString()} received for invoice ${invoice_id}. Thank you!`;
    
    try {
      await sendSMS(invoiceData.phone, message, 'payment_confirmation');
    } catch (smsError) {
      logger.error('SMS notification failed:', smsError);
    }

    // Get created payment with details
    const newPayment = await executeQuery(
      `SELECT p.*, c.name as customer_name, i.id as invoice_number, u.name as collector_name
       FROM payments p
       JOIN customers c ON p.customer_id = c.id
       JOIN invoices i ON p.invoice_id = i.id
       JOIN users u ON p.collector_id = u.id
       WHERE p.id = ?`,
      [paymentId]
    );

    res.status(201).json(newPayment[0]);
    logger.info(`Payment ${paymentId} created for invoice ${invoice_id} by ${req.user.email}`);
  } catch (error) {
    logger.error('Create payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payment statistics
router.get('/stats/summary', authenticateToken, checkPermission(['payments', 'all']), async (req, res) => {
  try {
    const stats = await executeQuery(`
      SELECT 
        COUNT(*) as total_payments,
        SUM(CASE WHEN status = 'confirmed' THEN amount ELSE 0 END) as total_amount,
        SUM(CASE WHEN payment_method = 'cash' AND status = 'confirmed' THEN amount ELSE 0 END) as cash_amount,
        SUM(CASE WHEN payment_method = 'mobile_money' AND status = 'confirmed' THEN amount ELSE 0 END) as mobile_money_amount,
        SUM(CASE WHEN payment_method = 'bank_transfer' AND status = 'confirmed' THEN amount ELSE 0 END) as bank_transfer_amount
      FROM payments
    `);

    res.json(stats[0]);
  } catch (error) {
    logger.error('Get payment stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;