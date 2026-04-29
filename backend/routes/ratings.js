const express = require('express');
const router  = express.Router();
const db      = require('../database');

router.post('/', async (req, res) => {
  const { from_email, to_email, connection_id, score, comment } = req.body;
  if (!from_email || !to_email || !connection_id || !score) return res.status(400).json({ error: 'Faltan datos.' });
  if (score < 1 || score > 5) return res.status(400).json({ error: 'Puntaje entre 1 y 5.' });
  try {
    const existing = await db.get(`SELECT id FROM ratings WHERE from_email = ? AND connection_id = ?`, [from_email, connection_id]);
    if (existing) return res.status(400).json({ error: 'Ya calificaste esta conexión.' });
    await db.run(`INSERT INTO ratings (from_email, to_email, connection_id, score, comment) VALUES (?, ?, ?, ?, ?)`, [from_email, to_email, connection_id, score, comment || '']);
    res.json({ message: 'Calificación guardada.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });
  try {
    const rows = await db.all(`SELECT score FROM ratings WHERE to_email = ?`, [email]);
    if (rows.length === 0) return res.json({ average: null, count: 0 });
    const total   = rows.reduce((sum, r) => sum + r.score, 0);
    const average = (total / rows.length).toFixed(1);
    res.json({ average: parseFloat(average), count: rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/mine', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });
  try {
    const rows = await db.all(`SELECT connection_id FROM ratings WHERE from_email = ?`, [email]);
    res.json({ rated: rows.map(r => r.connection_id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;