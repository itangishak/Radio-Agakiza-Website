import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { pool } from '../../../../api/config/db';

export async function GET() {
  try {
    // Test database connection
    const connection = await pool.getConnection();
    
    try {
      // Check if podcast_episodes table exists
      const [tables] = await connection.query(
        "SHOW TABLES LIKE 'podcast_episodes'"
      );
      
      const tableExists = tables.length > 0;
      let rowCount = 0;
      
      if (tableExists) {
        // Count rows in podcast_episodes
        const [rows] = await connection.query(
          'SELECT COUNT(*) as count FROM podcast_episodes'
        );
        rowCount = rows[0].count;
      }
      
      return NextResponse.json({
        status: 'success',
        database: {
          connected: true,
          podcast_episodes: {
            exists: tableExists,
            rowCount
          }
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Database connection failed', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
