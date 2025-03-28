const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection pool
const pool = mysql.createPool({
  host: 'mysql', // inside Docker network, the service name
  user: 'root',
  password: 'secret',
  database: 'cogtechai',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Health check
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Backend API is alive' });
});

// ✅ Prompt handler
app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;

  // MOCK RESPONSE
  const aiResponse = `🧠 MOCK AI RESPONSE: Here are interview questions for '${prompt}'`;

  try {
    const conn = await pool.getConnection();
    await conn.execute(
      'INSERT INTO prompts (prompt, response) VALUES (?, ?)',
      [prompt, aiResponse]
    );
    conn.release();

    res.json({ response: aiResponse });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ History fetcher
app.get('/api/history', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      'SELECT id, prompt, response, created_at FROM prompts ORDER BY created_at DESC LIMIT 50'
    );
    conn.release();

    res.json(rows);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Unable to fetch history' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
