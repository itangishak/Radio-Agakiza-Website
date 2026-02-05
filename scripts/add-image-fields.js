const mysql = require('mysql2/promise');
require('dotenv').config();

async function addImageFieldsToArticles() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'radio_agakiza'
  });

  try {
    console.log('Adding image fields to articles table...');
    
    // Add image fields to articles table
    await connection.execute(`
      ALTER TABLE articles 
      ADD COLUMN image_thumbnail VARCHAR(512) NULL AFTER cover_image_url,
      ADD COLUMN image_medium VARCHAR(512) NULL AFTER image_thumbnail,
      ADD COLUMN image_large VARCHAR(512) NULL AFTER image_medium
    `);

    console.log('✅ Successfully added image fields to articles table');
    
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️  Image fields already exist in articles table');
    } else {
      console.error('❌ Error adding image fields:', error.message);
      throw error;
    }
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  addImageFieldsToArticles()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addImageFieldsToArticles;
