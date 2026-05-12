const express = require('express');
const router  = express.Router();
const db      = require('../database');
const { sendProductConnectionEmail } = require('../services/email');

router.get('/', async (req, res) => {
  try {
    const rows = await db.all(`SELECT * FROM products ORDER BY id DESC`);
    res.json({ products: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/mine', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });
  try {
    const rows = await db.all(`SELECT * FROM products WHERE creator_email = ? ORDER BY id DESC`, [email]);
    res.json({ products: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { creator_name, creator_email, creator_photo, type, origin, destination, date, description, package_size, collaboration, contact_method, contact_info } = req.body;
  if (!creator_name || !origin || !destination || !date || !collaboration) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  // Anti-spam: máximo 5 publicaciones por usuario por día
  if (creator_email) {
    const hoy = new Date().toISOString().slice(0, 10);
    const publicaciones = await db.all(
      `SELECT id FROM products WHERE creator_email = ? AND date_created >= ?`,
      [creator_email, hoy]
    );
    if (publicaciones.length >= 5) {
      return res.status(429).json({ error: 'Llegaste al límite de 5 publicaciones por día. Intentá mañana.' });
    }
  }
  try {
    const result = await db.run(
      `INSERT INTO products (creator_name, creator_email, creator_photo, type, origin, destination, date, description, package_size, collaboration, contact_method, contact_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [creator_name, creator_email || '', creator_photo || '', type || 'send', origin, destination, date, description || '', package_size || 'pequeño', collaboration, contact_method || 'whatsapp', contact_info || '']
    );
    res.json({ message: 'Publicación creada.', productId: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  try {
    const row = await db.get(`SELECT creator_email FROM products WHERE id = ?`, [id]);
    if (!row) return res.status(404).json({ error: 'No encontrado.' });
    if (row.creator_email !== email) return res.status(403).json({ error: 'No podés borrar esto.' });
    await db.run(`DELETE FROM products WHERE id = ?`, [id]);
    res.json({ message: 'Eliminado.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/connections', async (req, res) => {
  const { product_id, requester_name, requester_email, owner_name, owner_email, origin, destination, date, collaboration, contact_method, contact_info } = req.body;
  if (!product_id || !requester_name || !owner_name) return res.status(400).json({ error: 'Faltan datos.' });
  try {
    const result = await db.run(
      `INSERT INTO product_connections (product_id, requester_name, requester_email, owner_name, owner_email, origin, destination, date, collaboration, contact_method, contact_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [product_id, requester_name, requester_email || '', owner_name, owner_email || '', origin || '', destination || '', date || '', collaboration || '', contact_method || 'whatsapp', contact_info || '']
    );
    if (owner_email) {
      sendProductConnectionEmail({ ownerEmail: owner_email, ownerName: owner_name, requesterName: requester_name, origin: origin || '', destination: destination || '', date: date || '' });
    }
    res.json({ message: 'Conexión creada.', connectionId: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/connections', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });
  try {
    const rows = await db.all(
      `SELECT * FROM product_connections WHERE requester_email = ? OR owner_email = ? ORDER BY id DESC`,
      [email, email]
    );
    res.json({ connections: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/connections/:id', async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  try {
    const row = await db.get(`SELECT requester_email, owner_email FROM product_connections WHERE id = ?`, [id]);
    if (!row) return res.status(404).json({ error: 'No encontrada.' });
    if (row.requester_email !== email && row.owner_email !== email) return res.status(403).json({ error: 'No podés borrar esto.' });
    await db.run(`DELETE FROM product_connections WHERE id = ?`, [id]);
    res.json({ message: 'Eliminada.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/connections', async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await db.all(`SELECT * FROM product_connections WHERE product_id = ? ORDER BY id DESC`, [id]);
    res.json({ connections: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;