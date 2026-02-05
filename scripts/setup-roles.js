const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupRoles() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'radio_agakiza'
  });

  try {
    // Insert roles if they don't exist
    const roles = [
      { name: 'admin', description: 'Full system access' },
      { name: 'manager', description: 'Content management access' },
      { name: 'journalist', description: 'Content creation access' }
    ];

    for (const role of roles) {
      await connection.execute(
        'INSERT IGNORE INTO roles (name, description) VALUES (?, ?)',
        [role.name, role.description]
      );
    }

    console.log('✅ Roles setup completed');
  } catch (error) {
    console.error('❌ Error setting up roles:', error.message);
  } finally {
    await connection.end();
  }
}

setupRoles();
