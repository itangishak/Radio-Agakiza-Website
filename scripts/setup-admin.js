const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'radio_agakiza'
  });

  try {
    // Create admin role if it doesn't exist
    await connection.execute(`
      INSERT IGNORE INTO roles (name, description) 
      VALUES ('admin', 'Administrator with full access')
    `);

    // Get admin role ID
    const [roleRows] = await connection.execute('SELECT id FROM roles WHERE name = ?', ['admin']);
    const adminRoleId = roleRows[0].id;

    // Hash password
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Create admin user
    await connection.execute(`
      INSERT INTO users (role_id, full_name, email, password_hash, is_active) 
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        password_hash = VALUES(password_hash),
        is_active = VALUES(is_active)
    `, [adminRoleId, 'Admin User', 'admin@radioagakiza.com', passwordHash, true]);

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@radioagakiza.com');
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error setting up admin:', error);
  } finally {
    await connection.end();
  }
}

setupAdmin();
