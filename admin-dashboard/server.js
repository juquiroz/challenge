const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'admin_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

// Initialize database connection
async function initDB() {
  try {
    pool = mysql.createPool(dbConfig);
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
    
    // Initialize schema (in production, this would be done via migration)
    // For simplicity, we assume the schema is already created
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

app.use(express.json());
app.use(express.static('public'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get calculation count
app.get('/api/count', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT count FROM calculation_count ORDER BY id DESC LIMIT 1');
    const count = rows.length > 0 ? rows[0].count : 0;
    res.json({ count });
  } catch (error) {
    console.error('Error fetching count:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Increment count (called by public app)
app.post('/api/increment', async (req, res) => {
  try {
    await pool.execute('UPDATE calculation_count SET count = count + 1 ORDER BY id DESC LIMIT 1');
    const [rows] = await pool.execute('SELECT count FROM calculation_count ORDER BY id DESC LIMIT 1');
    const count = rows.length > 0 ? rows[0].count : 0;
    res.json({ count, success: true });
  } catch (error) {
    console.error('Error incrementing count:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, '0.0.0.0', async () => {
  await initDB();
  console.log(`Admin dashboard running on port ${PORT}`);
});
