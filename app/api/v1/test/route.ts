import { NextResponse } from 'next/server';
import { pool } from '../../../../api/config/db';

export async function GET() {
  try {
    // Test database connection
    const [rows] = await pool.query('SHOW TABLES LIKE "podcast_episodes"');
    const tableExists = rows.length > 0;

    let episodeCount = 0;
    if (tableExists) {
      const [count] = await pool.query('SELECT COUNT(*) as count FROM podcast_episodes');
      episodeCount = count[0].count;
    }

    return NextResponse.json({
      status: 'success',
      database: {
        connected: true,
        tableExists,
        episodeCount,
        tables: rows
      }
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed', error: error.message },
      { status: 500 }
    );
  }
}
