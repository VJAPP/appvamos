const express = require('express');
const router  = express.Router();
const db      = require('../database');

router.get('/', async (req, res) => {
  try {
    const rows = await db.all(`SELECT * FROM trips ORDER BY id DESC`);
    res.json({ trips: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/mine', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });
  try {
    const rows = await db.all(`SELECT * FROM trips WHERE creator_email = ? ORDER BY id DESC`, [email]);
    res.json({ trips: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { creator_name, creator_email, creator_photo, type, origin, destination, date, collaboration, description, contact_method, contact_info } = req.body;
  if (!creator_name || !origin || !destination || !date || !collaboration) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  try {
    const result = await db.run(
      `INSERT INTO trips (creator_name, creator_email, creator_photo, type, origin, destination, date, collaboration, description, contact_method, contact_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [creator_name, creator_email || '', creator_photo || '', type || 'offer', origin, destination, date, collaboration, description || '', contact_method || 'whatsapp', contact_info || '']
    );
    res.json({ message: 'Viaje publicado.', tripId: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  try {
    const row = await db.get(`SELECT creator_email FROM trips WHERE id = ?`, [id]);
    if (!row) return res.status(404).json({ error: 'Viaje no encontrado.' });
    if (row.creator_email !== email) return res.status(403).json({ error: 'No podés borrar el viaje de otro usuario.' });
    await db.run(`DELETE FROM trips WHERE id = ?`, [id]);
    res.json({ message: 'Viaje eliminado.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/connections', async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await db.all(`SELECT * FROM connections WHERE trip_id = ? ORDER BY id DESC`, [id]);
    res.json({ connections: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;