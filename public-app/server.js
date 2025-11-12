const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const SERVICE_URL = process.env.SERVICE_URL || 'http://service:3000';
const DATA_DIR = process.env.DATA_DIR || '/data';
const DB_PATH = path.join(DATA_DIR, 'app.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS calculations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      a REAL,
      b REAL,
      result REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      }
    });
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get calculation count
app.get('/api/count', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM calculations', (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ count: row.count });
  });
});

// Calculate endpoint
app.post('/api/calculate', async (req, res) => {
  const { a, b } = req.body;
  
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'Both a and b must be numbers' });
  }
  
  try {
    // Call the service
    const response = await axios.post(`${SERVICE_URL}/sum`, { a, b });
    const result = response.data.result;
    
    // Store in database (stateful)
    db.run('INSERT INTO calculations (a, b, result) VALUES (?, ?, ?)', [a, b, result], function(err) {
      if (err) {
        console.error('Error storing calculation:', err);
        return res.status(500).json({ error: 'Failed to store calculation' });
      }
      
      // Notify admin dashboard (optional, can be async)
      axios.post(`${process.env.ADMIN_URL || 'http://admin-dashboard:3000'}/api/increment`, {})
        .catch(err => console.error('Failed to notify admin:', err));
      
      res.json({ result, id: this.lastID });
    });
  } catch (error) {
    console.error('Error calling service:', error.message);
    res.status(500).json({ error: 'Service unavailable' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Public app running on port ${PORT}`);
});
