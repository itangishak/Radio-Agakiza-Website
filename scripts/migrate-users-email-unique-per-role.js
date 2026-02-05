const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'radio_agakiza'
  });

  try {
    console.log('🔍 Checking indexes on `users` table...');
    const [indexes] = await connection.execute("SHOW INDEX FROM `users`");

    const uniqueEmailIndexes = indexes.filter(idx => idx.Column_name === 'email' && idx.Non_unique === 0);

    for (const idx of uniqueEmailIndexes) {
      if (idx.Key_name !== 'PRIMARY') {
        console.log(`🗑️  Dropping unique index on email: ${idx.Key_name}`);
        await connection.execute(`ALTER TABLE users DROP INDEX \`${idx.Key_name}\``);
      }
    }

    // Check if composite unique (email, role_id) exists
    const [composite] = await connection.execute("SHOW INDEX FROM `users` WHERE Key_name = 'uniq_users_email_role'");
    if (composite.length === 0) {
      console.log('➕ Adding composite unique index uniq_users_email_role (email, role_id)');
      await connection.execute("ALTER TABLE users ADD UNIQUE KEY `uniq_users_email_role` (`email`, `role_id`)");
    } else {
      console.log('✅ Composite unique index already exists: uniq_users_email_role');
    }

    console.log('✅ Migration complete. Users can now share the same email across different roles.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

migrate();
