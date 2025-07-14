const Joi = require('joi');

// Validation schemas
const schemas = {
  // User schemas
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  createUser: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'accountant', 'meter_reader').required(),
    phone: Joi.string().optional(),
    status: Joi.string().valid('active', 'inactive').default('active')
  }),

  updateUser: Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid('admin', 'accountant', 'meter_reader').optional(),
    phone: Joi.string().optional(),
    status: Joi.string().valid('active', 'inactive').optional()
  }),

  // Customer schemas
  createCustomer: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    phone: Joi.string().required(),
    email: Joi.string().email().optional(),
    address: Joi.string().required(),
    zone_id: Joi.string().required(),
    connection_type: Joi.string().valid('residential', 'commercial', 'industrial').default('residential')
  }),

  updateCustomer: Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    phone: Joi.string().optional(),
    email: Joi.string().email().optional(),
    address: Joi.string().optional(),
    zone_id: Joi.string().optional(),
    connection_type: Joi.string().valid('residential', 'commercial', 'industrial').optional(),
    status: Joi.string().valid('active', 'suspended', 'inactive').optional()
  }),

  // Meter reading schemas
  createReading: Joi.object({
    meter_id: Joi.string().required(),
    customer_id: Joi.string().required(),
    current_reading: Joi.number().min(0).required(),
    reading_date: Joi.date().required(),
    notes: Joi.string().optional(),
    photo_url: Joi.string().uri().optional(),
    gps_location: Joi.string().optional()
  }),

  approveReading: Joi.object({
    status: Joi.string().valid('approved', 'rejected', 'flagged').required(),
    rejection_reason: Joi.string().when('status', {
      is: 'rejected',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  }),

  // Payment schemas
  createPayment: Joi.object({
    invoice_id: Joi.string().required(),
    amount: Joi.number().min(0.01).required(),
    payment_method: Joi.string().valid('cash', 'bank_transfer', 'mobile_money', 'cheque', 'card').required(),
    reference_number: Joi.string().required(),
    payment_date: Joi.date().required(),
    notes: Joi.string().optional()
  }),

  // Invoice schemas
  updateInvoiceStatus: Joi.object({
    payment_status: Joi.string().valid('pending', 'partial', 'paid', 'overdue').required()
  }),

  // SMS schemas
  sendSMS: Joi.object({
    customer_id: Joi.string().required(),
    message: Joi.string().max(160).required(),
    message_type: Joi.string().valid('billing', 'payment_confirmation', 'reading_confirmation', 'reminder', 'alert', 'custom').required()
  })
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schemas[schema].validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

module.exports = { validate, schemas };