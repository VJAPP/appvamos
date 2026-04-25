const express = require('express');
const router  = express.Router();
const db      = require('../database');

router.get('/', (req, res) => {
  db.all(`SELECT * FROM trips ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener viajes.' });
    res.json({ trips: rows });
  });
});

router.post('/', (req, res) => {
  const {
    creator_name, creator_email, creator_photo,
    type, origin, destination, date,
    collaboration, description, contact_method, contact_info
  } = req.body;

  if (!creator_name || !origin || !destination || !date || !collaboration) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  const sql = `
    INSERT INTO trips
      (creator_name, creator_email, creator_photo, type, origin, destination,
       date, collaboration, description, contact_method, contact_info)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    creator_name, creator_email || '', creator_photo || '',
    type || 'offer', origin, destination, date,
    collaboration, description || '',
    contact_method || 'whatsapp', contact_info || ''
  ], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Viaje publicado.', tripId: this.lastID });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  db.get(`SELECT creator_email FROM trips WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error interno.' });
    if (!row) return res.status(404).json({ error: 'Viaje no encontrado.' });
    if (row.creator_email !== email) {
      return res.status(403).json({ error: 'No podés borrar el viaje de otro usuario.' });
    }
    db.run(`DELETE FROM trips WHERE id = ?`, [id], (err) => {
      if (err) return res.status(500).json({ error: 'Error al borrar.' });
      res.json({ message: 'Viaje eliminado.' });
    });
  });
});
// ---- MIS PUBLICACIONES (filtradas por email del creador) ----
router.get('/mine', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });

  db.all(
    `SELECT * FROM trips WHERE creator_email = ? ORDER BY id DESC`,
    [email],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ trips: rows });
    }
  );
});

// ---- QUIÉN SE CONECTÓ A UN VIAJE MÍO ----
router.get('/:id/connections', (req, res) => {
  const { id } = req.params;

  db.all(
    `SELECT * FROM connections WHERE trip_id = ? ORDER BY id DESC`,
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ connections: rows });
    }
  );
});
module.exports = router;