const mysql = require('mysql2/promise');
require('dotenv').config();

async function addSampleData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'radio_agakiza'
  });

  try {
    // Get admin user ID
    const [userRows] = await connection.execute('SELECT id FROM users WHERE email = ?', ['admin@radioagakiza.com']);
    const adminId = userRows[0]?.id;

    if (!adminId) {
      console.log('❌ Admin user not found. Run setup-admin.js first.');
      return;
    }

    // Add sample hosts
    await connection.execute(`
      INSERT IGNORE INTO hosts (full_name, bio) VALUES 
      ('John Uwimana', 'Morning show host'),
      ('Marie Mukamana', 'Evening program presenter'),
      ('Pastor David', 'Religious program host')
    `);

    // Add sample programs
    const [programResult] = await connection.execute(`
      INSERT IGNORE INTO programs (name, slug, description, is_active, created_by) VALUES 
      ('Morning Glory', 'morning-glory', 'Start your day with inspiration', 1, ?),
      ('Evening Praise', 'evening-praise', 'End your day with worship', 1, ?),
      ('Youth Hour', 'youth-hour', 'Programs for young people', 1, ?)
    `, [adminId, adminId, adminId]);

    // Add sample articles
    await connection.execute(`
      INSERT IGNORE INTO articles (title, slug, content, status, author_id, published_at) VALUES 
      ('Welcome to Radio Agakiza', 'welcome-to-radio-agakiza', 'We are excited to launch our new website...', 'published', ?, NOW()),
      ('New Program Schedule', 'new-program-schedule', 'Check out our updated program schedule...', 'published', ?, NOW()),
      ('Community Outreach', 'community-outreach', 'Our recent community activities...', 'draft', ?, NULL)
    `, [adminId, adminId, adminId]);

    // Add sample podcast series
    await connection.execute(`
      INSERT IGNORE INTO podcast_series (title, slug, description, author_id, is_active) VALUES 
      ('Daily Devotions', 'daily-devotions', 'Short daily inspirational messages', ?, 1),
      ('Sunday Sermons', 'sunday-sermons', 'Weekly sermon recordings', ?, 1)
    `, [adminId, adminId]);

    // Add sample testimonials
    await connection.execute(`
      INSERT IGNORE INTO testimonials (author_name, role, message, is_published, created_by, published_at) VALUES 
      ('Grace Uwimana', 'listener', 'Radio Agakiza has blessed my life tremendously!', 1, ?, NOW()),
      ('Pastor Emmanuel', 'pastor', 'Great platform for spreading the Gospel', 1, ?, NOW()),
      ('Youth Group Leader', 'partner', 'The youth programs are excellent', 0, ?, NULL)
    `, [adminId, adminId, adminId]);

    // Add default stream URL setting
    await connection.execute(`
      INSERT IGNORE INTO app_settings (settings_key, settings_value, updated_by) VALUES 
      ('stream.live_url', 'https://cast6.asurahosting.com/proxy/radioaga/stream', ?)
    `, [adminId]);

    console.log('✅ Sample data added successfully');
    console.log('📊 Added: Programs, Articles, Testimonials, and Settings');

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  } finally {
    await connection.end();
  }
}

addSampleData();
