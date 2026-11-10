// ========================================================
// VIBELY DATABASE CONNECTION
// MySQL2 connection pool with promise API
// ========================================================

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'vibely_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection on startup
export async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected to:', process.env.DB_NAME);
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    console.error('   Make sure MySQL is running and .env is configured correctly.');
  }
}

export default pool;
