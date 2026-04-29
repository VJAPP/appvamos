const express = require('express');
const router  = express.Router();
const db      = require('../database');
const { sendConnectionEmail } = require('../services/email');

router.post('/', async (req, res) => {
  const { trip_id, requester_name, requester_email, owner_name, owner_email, origin, destination, date, collaboration, contact_method, contact_info } = req.body;
  if (!trip_id || !requester_name || !owner_name) {
    return res.status(400).json({ error: 'Faltan datos.' });
  }
  try {
    const result = await db.run(
      `INSERT INTO connections (trip_id, requester_name, requester_email, owner_name, owner_email, origin, destination, date, collaboration, contact_method, contact_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [trip_id, requester_name, requester_email || '', owner_name, owner_email || '', origin || '', destination || '', date || '', collaboration || '', contact_method || 'whatsapp', contact_info || '']
    );
    if (owner_email) {
      sendConnectionEmail({ ownerEmail: owner_email, ownerName: owner_name, requesterName: requester_name, origin: origin || '', destination: destination || '', date: date || '' });
    }
    res.json({ message: 'Conexión creada.', connectionId: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });
  try {
    const rows = await db.all(
      `SELECT * FROM connections WHERE requester_email = ? OR owner_email = ? ORDER BY id DESC`,
      [email, email]
    );
    res.json({ connections: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  try {
    const row = await db.get(`SELECT requester_email, owner_email FROM connections WHERE id = ?`, [id]);
    if (!row) return res.status(404).json({ error: 'No encontrada.' });
    if (row.requester_email !== email && row.owner_email !== email) return res.status(403).json({ error: 'No podés borrar esto.' });
    await db.run(`DELETE FROM connections WHERE id = ?`, [id]);
    res.json({ message: 'Eliminada.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;