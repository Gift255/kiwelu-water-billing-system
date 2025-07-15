const bcrypt = require('bcryptjs');
const { executeQuery, testConnection, logger } = require('../config/database');

async function seedAdminUser() {
  try {
    // Test database connection first
    const connected = await testConnection();
    if (!connected) {
      logger.error('Database connection failed');
      process.exit(1);
    }

    const email = 'giftgyft@gmail.com';
    const password = 'Tanzania123';
    const name = 'System Administrator';
    const role = 'admin';

    // Check if user already exists
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      logger.info(`Admin user ${email} already exists`);
      process.exit(0);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate user ID
    const userId = `U${Date.now()}`;

    // Insert admin user
    await executeQuery(
      `INSERT INTO users (id, name, email, password_hash, role, status, created_at) 
       VALUES (?, ?, ?, ?, ?, 'active', NOW())`,
      [userId, name, email, passwordHash, role]
    );

    logger.info(`✅ Admin user created successfully:`);
    logger.info(`   Email: ${email}`);
    logger.info(`   Password: ${password}`);
    logger.info(`   Role: ${role}`);
    logger.info(`   User ID: ${userId}`);

    console.log('\n🎉 Admin user has been created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Role: ${role}`);
    console.log('\nYou can now login to the system with these credentials.\n');

  } catch (error) {
    logger.error('Error creating admin user:', error);
    console.error('❌ Failed to create admin user:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the seeding function
seedAdminUser();