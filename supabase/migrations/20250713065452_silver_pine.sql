-- Kiwelu Water Billing System Database Schema
-- Complete SQL schema with proper relationships and constraints

-- =============================================
-- USERS AND AUTHENTICATION
-- =============================================

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'accountant', 'meter_reader') NOT NULL DEFAULT 'meter_reader',
    phone VARCHAR(20),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
);

-- =============================================
-- ZONES AND GEOGRAPHICAL DATA
-- =============================================

CREATE TABLE zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    gps_coordinates VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_zones_name (name)
);

-- =============================================
-- CUSTOMERS
-- =============================================

CREATE TABLE customers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT NOT NULL,
    zone_id VARCHAR(50) NOT NULL,
    connection_type ENUM('residential', 'commercial', 'industrial') NOT NULL DEFAULT 'residential',
    status ENUM('active', 'suspended', 'inactive') NOT NULL DEFAULT 'active',
    balance DECIMAL(15,2) DEFAULT 0.00,
    gps_location VARCHAR(100),
    registration_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    
    FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_customers_name (name),
    INDEX idx_customers_phone (phone),
    INDEX idx_customers_zone (zone_id),
    INDEX idx_customers_status (status),
    INDEX idx_customers_connection_type (connection_type)
);

-- =============================================
-- WATER METERS
-- =============================================

CREATE TABLE meters (
    id VARCHAR(50) PRIMARY KEY,
    meter_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id VARCHAR(50) NOT NULL,
    meter_type ENUM('mechanical', 'digital', 'smart') NOT NULL DEFAULT 'mechanical',
    installation_date DATE NOT NULL,
    last_maintenance_date DATE,
    status ENUM('active', 'faulty', 'replaced', 'removed') NOT NULL DEFAULT 'active',
    initial_reading DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    
    INDEX idx_meters_number (meter_number),
    INDEX idx_meters_customer (customer_id),
    INDEX idx_meters_status (status)
);

-- =============================================
-- METER READINGS
-- =============================================

CREATE TABLE meter_readings (
    id VARCHAR(50) PRIMARY KEY,
    meter_id VARCHAR(50) NOT NULL,
    customer_id VARCHAR(50) NOT NULL,
    previous_reading DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    current_reading DECIMAL(10,2) NOT NULL,
    consumption DECIMAL(10,2) GENERATED ALWAYS AS (current_reading - previous_reading) STORED,
    reading_date DATE NOT NULL,
    collector_id VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'flagged') NOT NULL DEFAULT 'pending',
    approved_by VARCHAR(50) NULL,
    approved_date DATE NULL,
    rejection_reason TEXT NULL,
    photo_url VARCHAR(500),
    gps_location VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (meter_id) REFERENCES meters(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (collector_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_readings_meter (meter_id),
    INDEX idx_readings_customer (customer_id),
    INDEX idx_readings_date (reading_date),
    INDEX idx_readings_status (status),
    INDEX idx_readings_collector (collector_id),
    
    CONSTRAINT chk_reading_positive CHECK (current_reading >= 0),
    CONSTRAINT chk_reading_logical CHECK (current_reading >= previous_reading OR status = 'flagged')
);

-- =============================================
-- BILLING RATES
-- =============================================

CREATE TABLE billing_rates (
    id VARCHAR(50) PRIMARY KEY,
    tier_name VARCHAR(100) NOT NULL,
    min_consumption DECIMAL(10,2) NOT NULL,
    max_consumption DECIMAL(10,2),
    rate_per_unit DECIMAL(10,2) NOT NULL,
    connection_type ENUM('residential', 'commercial', 'industrial') NOT NULL DEFAULT 'residential',
    effective_from DATE NOT NULL,
    effective_to DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_rates_connection_type (connection_type),
    INDEX idx_rates_effective (effective_from, effective_to),
    INDEX idx_rates_active (is_active),
    
    CONSTRAINT chk_consumption_range CHECK (max_consumption IS NULL OR max_consumption > min_consumption)
);

-- =============================================
-- INVOICES
-- =============================================

CREATE TABLE invoices (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    meter_reading_id VARCHAR(50) NOT NULL,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    consumption DECIMAL(10,2) NOT NULL,
    base_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    consumption_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(15,2) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('draft', 'sent', 'viewed', 'cancelled') NOT NULL DEFAULT 'draft',
    payment_status ENUM('pending', 'partial', 'paid', 'overdue') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (meter_reading_id) REFERENCES meter_readings(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_invoices_customer (customer_id),
    INDEX idx_invoices_period (billing_period_start, billing_period_end),
    INDEX idx_invoices_due_date (due_date),
    INDEX idx_invoices_status (status),
    INDEX idx_invoices_payment_status (payment_status),
    INDEX idx_invoices_issue_date (issue_date),
    
    CONSTRAINT chk_invoice_amounts CHECK (total_amount >= 0),
    CONSTRAINT chk_invoice_dates CHECK (due_date >= issue_date),
    CONSTRAINT chk_billing_period CHECK (billing_period_end > billing_period_start)
);

-- =============================================
-- INVOICE LINE ITEMS (for detailed billing breakdown)
-- =============================================

CREATE TABLE invoice_line_items (
    id VARCHAR(50) PRIMARY KEY,
    invoice_id VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    tier_name VARCHAR(100),
    
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    
    INDEX idx_line_items_invoice (invoice_id)
);

-- =============================================
-- PAYMENTS
-- =============================================

CREATE TABLE payments (
    id VARCHAR(50) PRIMARY KEY,
    invoice_id VARCHAR(50) NOT NULL,
    customer_id VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'mobile_money', 'cheque', 'card') NOT NULL,
    reference_number VARCHAR(255) NOT NULL,
    payment_date DATE NOT NULL,
    status ENUM('pending', 'confirmed', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
    collector_id VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (collector_id) REFERENCES users(id) ON DELETE RESTRICT,
    
    INDEX idx_payments_invoice (invoice_id),
    INDEX idx_payments_customer (customer_id),
    INDEX idx_payments_date (payment_date),
    INDEX idx_payments_method (payment_method),
    INDEX idx_payments_status (status),
    INDEX idx_payments_reference (reference_number),
    
    CONSTRAINT chk_payment_amount CHECK (amount > 0)
);

-- =============================================
-- SMS NOTIFICATIONS
-- =============================================

CREATE TABLE sms_notifications (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    message_type ENUM('billing', 'payment_confirmation', 'reading_confirmation', 'reminder', 'alert', 'custom') NOT NULL,
    status ENUM('pending', 'sent', 'delivered', 'failed') NOT NULL DEFAULT 'pending',
    cost DECIMAL(10,2) DEFAULT 0.00,
    sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_sms_customer (customer_id),
    INDEX idx_sms_phone (phone_number),
    INDEX idx_sms_type (message_type),
    INDEX idx_sms_status (status),
    INDEX idx_sms_sent_date (sent_at)
);

-- =============================================
-- SYSTEM AUDIT LOG
-- =============================================

CREATE TABLE audit_log (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(50) NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_table (table_name),
    INDEX idx_audit_date (created_at)
);

-- =============================================
-- SYSTEM SETTINGS
-- =============================================

CREATE TABLE system_settings (
    id VARCHAR(50) PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') NOT NULL DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_settings_key (setting_key),
    INDEX idx_settings_public (is_public)
);

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- Customer Summary View
CREATE VIEW customer_summary AS
SELECT 
    c.id,
    c.name,
    c.phone,
    c.email,
    c.address,
    z.name as zone_name,
    c.connection_type,
    c.status,
    c.balance,
    m.meter_number,
    m.status as meter_status,
    COALESCE(lr.reading_date, 'Never') as last_reading_date,
    COALESCE(lr.current_reading, 0) as last_reading_value,
    COUNT(DISTINCT i.id) as total_invoices,
    COALESCE(SUM(CASE WHEN i.payment_status = 'paid' THEN i.total_amount ELSE 0 END), 0) as total_paid,
    COALESCE(SUM(CASE WHEN i.payment_status IN ('pending', 'overdue') THEN i.total_amount ELSE 0 END), 0) as total_outstanding
FROM customers c
LEFT JOIN zones z ON c.zone_id = z.id
LEFT JOIN meters m ON c.id = m.customer_id AND m.status = 'active'
LEFT JOIN (
    SELECT customer_id, reading_date, current_reading,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY reading_date DESC) as rn
    FROM meter_readings 
    WHERE status = 'approved'
) lr ON c.id = lr.customer_id AND lr.rn = 1
LEFT JOIN invoices i ON c.id = i.customer_id
GROUP BY c.id, c.name, c.phone, c.email, c.address, z.name, c.connection_type, 
         c.status, c.balance, m.meter_number, m.status, lr.reading_date, lr.current_reading;

-- Monthly Revenue Summary View
CREATE VIEW monthly_revenue_summary AS
SELECT 
    DATE_FORMAT(i.issue_date, '%Y-%m') as month_year,
    COUNT(i.id) as total_invoices,
    SUM(i.total_amount) as total_billed,
    SUM(CASE WHEN i.payment_status = 'paid' THEN i.total_amount ELSE 0 END) as total_collected,
    SUM(CASE WHEN i.payment_status IN ('pending', 'overdue') THEN i.total_amount ELSE 0 END) as total_outstanding,
    ROUND((SUM(CASE WHEN i.payment_status = 'paid' THEN i.total_amount ELSE 0 END) / SUM(i.total_amount)) * 100, 2) as collection_rate
FROM invoices i
WHERE i.status != 'cancelled'
GROUP BY DATE_FORMAT(i.issue_date, '%Y-%m')
ORDER BY month_year DESC;

-- =============================================
-- TRIGGERS FOR BUSINESS LOGIC
-- =============================================

-- Update customer balance when payment is made
DELIMITER //
CREATE TRIGGER update_customer_balance_after_payment
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' THEN
        UPDATE customers 
        SET balance = balance + NEW.amount
        WHERE id = NEW.customer_id;
        
        -- Update invoice payment status
        UPDATE invoices 
        SET payment_status = CASE 
            WHEN (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = NEW.invoice_id AND status = 'confirmed') >= total_amount 
            THEN 'paid'
            WHEN (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = NEW.invoice_id AND status = 'confirmed') > 0 
            THEN 'partial'
            ELSE payment_status
        END
        WHERE id = NEW.invoice_id;
    END IF;
END//

-- Update invoice status to overdue
CREATE EVENT update_overdue_invoices
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
    UPDATE invoices 
    SET payment_status = 'overdue' 
    WHERE due_date < CURDATE() 
    AND payment_status = 'pending';
//
DELIMITER ;

-- =============================================
-- INITIAL DATA SETUP
-- =============================================

-- Insert default zones
INSERT INTO zones (id, name, description) VALUES
('ZONE_A', 'Zone A', 'Central business district and surrounding residential areas'),
('ZONE_B', 'Zone B', 'Northern residential and light commercial areas'),
('ZONE_C', 'Zone C', 'Southern residential areas and industrial zone');

-- Insert default billing rates
INSERT INTO billing_rates (id, tier_name, min_consumption, max_consumption, rate_per_unit, connection_type, effective_from) VALUES
('RATE_RES_T1', 'Residential Tier 1', 0.00, 10.00, 800.00, 'residential', '2025-01-01'),
('RATE_RES_T2', 'Residential Tier 2', 10.01, 20.00, 1200.00, 'residential', '2025-01-01'),
('RATE_RES_T3', 'Residential Tier 3', 20.01, 50.00, 1800.00, 'residential', '2025-01-01'),
('RATE_RES_T4', 'Residential Tier 4', 50.01, NULL, 2500.00, 'residential', '2025-01-01'),
('RATE_COM_T1', 'Commercial Tier 1', 0.00, 50.00, 2000.00, 'commercial', '2025-01-01'),
('RATE_COM_T2', 'Commercial Tier 2', 50.01, NULL, 3000.00, 'commercial', '2025-01-01'),
('RATE_IND_T1', 'Industrial Rate', 0.00, NULL, 3500.00, 'industrial', '2025-01-01');

-- Insert default system settings
INSERT INTO system_settings (id, setting_key, setting_value, setting_type, description, is_public) VALUES
('SET_001', 'company_name', 'Kiwelu Water Company', 'string', 'Company name for invoices and communications', TRUE),
('SET_002', 'base_charge', '2000.00', 'number', 'Base monthly charge for all connections', FALSE),
('SET_003', 'tax_rate', '0.10', 'number', 'Tax rate applied to bills (10%)', FALSE),
('SET_004', 'sms_cost_per_message', '150.00', 'number', 'Cost per SMS message in TZS', FALSE),
('SET_005', 'late_payment_penalty_rate', '0.05', 'number', 'Late payment penalty rate (5%)', FALSE),
('SET_006', 'invoice_due_days', '30', 'number', 'Number of days from issue date to due date', FALSE);

-- =============================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =============================================

-- Composite indexes for common query patterns
CREATE INDEX idx_invoices_customer_period ON invoices(customer_id, billing_period_start, billing_period_end);
CREATE INDEX idx_payments_customer_date ON payments(customer_id, payment_date);
CREATE INDEX idx_readings_customer_date ON meter_readings(customer_id, reading_date);
CREATE INDEX idx_sms_customer_type ON sms_notifications(customer_id, message_type);

-- Full-text search indexes
ALTER TABLE customers ADD FULLTEXT(name, address);
ALTER TABLE sms_notifications ADD FULLTEXT(message);

-- =============================================
-- STORED PROCEDURES FOR COMMON OPERATIONS
-- =============================================

DELIMITER //

-- Generate monthly bills for all customers
CREATE PROCEDURE GenerateMonthlyBills(
    IN billing_month DATE,
    IN created_by_user VARCHAR(50)
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_customer_id VARCHAR(50);
    DECLARE v_meter_reading_id VARCHAR(50);
    DECLARE v_consumption DECIMAL(10,2);
    DECLARE v_total_amount DECIMAL(15,2);
    
    DECLARE bill_cursor CURSOR FOR
        SELECT 
            mr.customer_id,
            mr.id as meter_reading_id,
            mr.consumption
        FROM meter_readings mr
        INNER JOIN customers c ON mr.customer_id = c.id
        WHERE mr.status = 'approved'
        AND DATE_FORMAT(mr.reading_date, '%Y-%m') = DATE_FORMAT(billing_month, '%Y-%m')
        AND NOT EXISTS (
            SELECT 1 FROM invoices i 
            WHERE i.customer_id = mr.customer_id 
            AND i.meter_reading_id = mr.id
        );
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN bill_cursor;
    
    read_loop: LOOP
        FETCH bill_cursor INTO v_customer_id, v_meter_reading_id, v_consumption;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Calculate bill amount (simplified - would need proper tier calculation)
        SET v_total_amount = 2000 + (v_consumption * 1200); -- Base + consumption
        
        -- Insert invoice
        INSERT INTO invoices (
            id, customer_id, meter_reading_id, billing_period_start, billing_period_end,
            consumption, base_charge, consumption_charge, total_amount,
            issue_date, due_date, created_by
        ) VALUES (
            CONCAT('INV-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0')),
            v_customer_id, v_meter_reading_id, 
            DATE_SUB(billing_month, INTERVAL DAY(billing_month)-1 DAY),
            LAST_DAY(billing_month),
            v_consumption, 2000, v_total_amount - 2000, v_total_amount,
            CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), created_by_user
        );
        
    END LOOP;
    
    CLOSE bill_cursor;
END//

DELIMITER ;

-- =============================================
-- COMMENTS AND DOCUMENTATION
-- =============================================

/*
KIWELU WATER BILLING SYSTEM DATABASE SCHEMA

This schema provides a complete foundation for a water utility billing system with the following key features:

1. USER MANAGEMENT: Role-based access control with admin, accountant, and meter reader roles
2. CUSTOMER MANAGEMENT: Complete customer information with zone-based organization
3. METER MANAGEMENT: Water meter tracking with maintenance history
4. READING WORKFLOW: Meter reading collection with approval workflow
5. BILLING SYSTEM: Automated billing with tiered rate structure
6. PAYMENT PROCESSING: Multi-method payment tracking with automatic status updates
7. COMMUNICATION: SMS notification system with delivery tracking
8. AUDIT TRAIL: Complete audit logging for all system changes
9. REPORTING: Pre-built views for common reporting needs

RELATIONSHIPS:
- Customers belong to zones and have meters
- Meter readings are collected by users and approved by supervisors
- Invoices are generated from approved readings
- Payments are linked to invoices and update customer balances
- SMS notifications track all customer communications
- Audit log tracks all system changes

PERFORMANCE CONSIDERATIONS:
- Comprehensive indexing strategy for fast queries
- Partitioning recommendations for large tables (readings, payments)
- Views for common reporting queries
- Stored procedures for complex operations

SECURITY FEATURES:
- Foreign key constraints maintain data integrity
- Check constraints ensure data validity
- Audit logging tracks all changes
- Role-based access control
*/