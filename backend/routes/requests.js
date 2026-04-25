// Rutas de conexiones entre personas (sección Personas)
const express = require('express');
const router  = express.Router();
const db      = require('../database');
const { sendConnectionEmail } = require('../services/email');

// ---- CREAR CONEXIÓN ----
router.post('/', (req, res) => {
  const {
    trip_id,
    requester_name, requester_email,
    owner_name, owner_email,
    origin, destination, date, collaboration,
    contact_method, contact_info
  } = req.body;

  if (!trip_id || !requester_name || !owner_name) {
    return res.status(400).json({ error: 'Faltan datos para crear la conexión.' });
  }

  const sql = `
    INSERT INTO connections
      (trip_id, requester_name, requester_email, owner_name, owner_email,
       origin, destination, date, collaboration, contact_method, contact_info)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
      trip_id,
      requester_name, requester_email || '',
      owner_name, owner_email || '',
      origin || '', destination || '', date || '', collaboration || '',
      contact_method || 'whatsapp', contact_info || ''
    ], function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Enviamos el email al dueño del viaje (no bloqueamos si falla)
      if (owner_email) {
        sendConnectionEmail({
          ownerEmail:    owner_email,
          ownerName:     owner_name,
          requesterName: requester_name,
          origin:        origin || '',
          destination:   destination || '',
          date:          date || '',
        });
      }

      res.json({ message: 'Conexión creada.', connectionId: this.lastID });
    });
});

// ---- VER MIS CONEXIONES ----
router.get('/', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });

  db.all(
    `SELECT * FROM connections WHERE requester_email = ? OR owner_email = ? ORDER BY id DESC`,
    [email, email],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ connections: rows });
    }
  );
});

// ---- BORRAR CONEXIÓN ----
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  db.get(`SELECT requester_email, owner_email FROM connections WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Conexión no encontrada.' });
    if (row.requester_email !== email && row.owner_email !== email) {
      return res.status(403).json({ error: 'No podés borrar la conexión de otro usuario.' });
    }
    db.run(`DELETE FROM connections WHERE id = ?`, [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Conexión eliminada.' });
    });
  });
});

module.exports = router;