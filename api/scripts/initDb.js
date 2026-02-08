const { pool } = require('../config/db');

async function initDatabase() {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Create podcast_series table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS podcast_series (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image_url VARCHAR(512),
        author_id INT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    // Create podcast_episodes table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS podcast_episodes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        series_id INT,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        audio_url VARCHAR(512) NOT NULL,
        source ENUM('upload', 'external') NOT NULL DEFAULT 'external',
        duration_seconds INT,
        episode_number INT,
        status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
        published_at TIMESTAMP NULL,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (series_id) REFERENCES podcast_series(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    await connection.commit();
    console.log('Database tables created successfully');
  } catch (error) {
    await connection.rollback();
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Run the initialization
initDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
