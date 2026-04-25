const express = require('express');
const router  = express.Router();
const db      = require('../database');
const { sendProductConnectionEmail } = require('../services/email');

router.get('/', (req, res) => {
  db.all(`SELECT * FROM products ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ products: rows });
  });
});

router.post('/', (req, res) => {
  const {
    creator_name, creator_email, creator_photo, type,
    origin, destination, date, description,
    package_size, collaboration, contact_method, contact_info
  } = req.body;

  if (!creator_name || !origin || !destination || !date || !collaboration) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  const sql = `
    INSERT INTO products
      (creator_name, creator_email, creator_photo, type, origin, destination,
       date, description, package_size, collaboration, contact_method, contact_info)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    creator_name, creator_email || '', creator_photo || '',
    type || 'send', origin, destination, date,
    description || '', package_size || 'pequeño', collaboration,
    contact_method || 'whatsapp', contact_info || ''
  ], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Publicación creada.', productId: this.lastID });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  db.get(`SELECT creator_email FROM products WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'No encontrado.' });
    if (row.creator_email !== email) {
      return res.status(403).json({ error: 'No podés borrar esto.' });
    }
    db.run(`DELETE FROM products WHERE id = ?`, [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Eliminado.' });
    });
  });
});

router.post('/connections', (req, res) => {
  const {
    product_id, requester_name, requester_email,
    owner_name, owner_email, origin, destination,
    date, collaboration, contact_method, contact_info
  } = req.body;

  if (!product_id || !requester_name || !owner_name) {
    return res.status(400).json({ error: 'Faltan datos.' });
  }

  db.run(sql, [
      product_id, requester_name, requester_email || '',
      owner_name, owner_email || '', origin || '',
      destination || '', date || '', collaboration || '',
      contact_method || 'whatsapp', contact_info || ''
    ], function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Email al dueño de la publicación
      if (owner_email) {
        sendProductConnectionEmail({
          ownerEmail:    owner_email,
          ownerName:     owner_name,
          requesterName: requester_name,
          origin:        origin || '',
          destination:   destination || '',
          date:          date || '',
          packageSize:   null,
        });
      }

      res.json({ message: 'Conexión creada.', connectionId: this.lastID });
    });
});

router.get('/connections', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });

  db.all(
    `SELECT * FROM product_connections WHERE requester_email = ? OR owner_email = ? ORDER BY id DESC`,
    [email, email],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ connections: rows });
    }
  );
});

router.delete('/connections/:id', (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  db.get(`SELECT requester_email, owner_email FROM product_connections WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'No encontrada.' });
    if (row.requester_email !== email && row.owner_email !== email) {
      return res.status(403).json({ error: 'No podés borrar esto.' });
    }
    db.run(`DELETE FROM product_connections WHERE id = ?`, [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Eliminada.' });
    });
  });
});
// ---- MIS PUBLICACIONES DE PRODUCTOS ----
router.get('/mine', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });

  db.all(
    `SELECT * FROM products WHERE creator_email = ? ORDER BY id DESC`,
    [email],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ products: rows });
    }
  );
});

// ---- QUIÉN SE CONECTÓ A UN PRODUCTO MÍO ----
router.get('/:id/connections', (req, res) => {
  const { id } = req.params;

  db.all(
    `SELECT * FROM product_connections WHERE product_id = ? ORDER BY id DESC`,
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ connections: rows });
    }
  );
});
module.exports = router;