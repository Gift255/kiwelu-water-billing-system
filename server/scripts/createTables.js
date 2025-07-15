const { executeQuery, testConnection, logger } = require('../config/database');

async function createTables() {
  try {
    // Test database connection first
    const connected = await testConnection();
    if (!connected) {
      logger.error('Database connection failed');
      process.exit(1);
    }

    logger.info('Creating database tables...');

    // Create zones table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS zones (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        gps_coordinates VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_zones_name (name)
      )
    `);

    // Create users table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
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
      )
    `);

    // Create customers table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS customers (
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
      )
    `);

    // Create meters table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS meters (
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
      )
    `);

    // Insert default zones
    await executeQuery(`
      INSERT IGNORE INTO zones (id, name, description) VALUES
      ('ZONE_A', 'Zone A', 'Central business district and surrounding residential areas'),
      ('ZONE_B', 'Zone B', 'Northern residential and light commercial areas'),
      ('ZONE_C', 'Zone C', 'Southern residential areas and industrial zone')
    `);

    logger.info('✅ Database tables created successfully');
    console.log('\n🎉 Database tables have been created successfully!');
    console.log('📊 Tables created:');
    console.log('   - zones');
    console.log('   - users');
    console.log('   - customers');
    console.log('   - meters');
    console.log('\n🌍 Default zones have been added:');
    console.log('   - Zone A: Central business district');
    console.log('   - Zone B: Northern residential areas');
    console.log('   - Zone C: Southern residential areas');

  } catch (error) {
    logger.error('Error creating tables:', error);
    console.error('❌ Failed to create tables:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the table creation
createTables();