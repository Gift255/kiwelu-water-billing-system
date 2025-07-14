const twilio = require('twilio');
const { executeQuery, logger } = require('../config/database');

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send SMS function
const sendSMS = async (phoneNumber, message, messageType = 'custom', customerId = null) => {
  try {
    // Format phone number (ensure it starts with +)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    // Send SMS via Twilio
    const twilioMessage = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    // Log SMS in database
    const smsId = `SMS-${Date.now()}`;
    const cost = 150; // TZS per SMS

    await executeQuery(
      `INSERT INTO sms_notifications 
       (id, customer_id, phone_number, message, message_type, status, cost, sent_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [smsId, customerId, formattedPhone, message, messageType, 'sent', cost]
    );

    // Update to delivered status (in real implementation, you'd use webhooks)
    setTimeout(async () => {
      try {
        await executeQuery(
          'UPDATE sms_notifications SET status = ?, delivered_at = NOW() WHERE id = ?',
          ['delivered', smsId]
        );
      } catch (error) {
        logger.error('Failed to update SMS status:', error);
      }
    }, 2000);

    logger.info(`SMS sent successfully to ${formattedPhone}: ${twilioMessage.sid}`);
    return {
      success: true,
      messageId: twilioMessage.sid,
      smsId: smsId
    };

  } catch (error) {
    logger.error('SMS sending failed:', error);

    // Log failed SMS in database
    if (customerId) {
      const smsId = `SMS-${Date.now()}`;
      await executeQuery(
        `INSERT INTO sms_notifications 
         (id, customer_id, phone_number, message, message_type, status, error_message, sent_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [smsId, customerId, phoneNumber, message, messageType, 'failed', error.message]
      );
    }

    throw error;
  }
};

// Send bulk SMS
const sendBulkSMS = async (recipients, message, messageType = 'custom') => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const result = await sendSMS(recipient.phone, message, messageType, recipient.customerId);
      results.push({
        customerId: recipient.customerId,
        phone: recipient.phone,
        success: true,
        messageId: result.messageId
      });
    } catch (error) {
      results.push({
        customerId: recipient.customerId,
        phone: recipient.phone,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
};

// Get SMS statistics
const getSMSStats = async () => {
  try {
    const stats = await executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(cost) as total_cost
      FROM sms_notifications
    `);

    return stats[0];
  } catch (error) {
    logger.error('Get SMS stats error:', error);
    throw error;
  }
};

module.exports = {
  sendSMS,
  sendBulkSMS,
  getSMSStats
};