const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcrypt');
const multer   = require('multer');
const cloudinary = require('cloudinary').v2;
const db       = require('../database');

const SALT_ROUNDS = 10;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

// ---- REGISTRO ----
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await db.run(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashedPassword]
    );
    res.json({ message: 'Registro exitoso.' });
  } catch (err) {
    if (err.message.includes('unique') || err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Ese email ya está registrado.' });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// ---- LOGIN ----
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
  }
  try {
    const row = await db.get(
      `SELECT id, name, email, password, photo_url, city FROM users WHERE email = ?`,
      [email]
    );
    if (!row) return res.status(401).json({ error: 'Email o contraseña incorrectos.' });

    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(401).json({ error: 'Email o contraseña incorrectos.' });

    res.json({
      message: 'Login exitoso.',
      user: { id: row.id, name: row.name, email: row.email, photo_url: row.photo_url || '', city: row.city || '' }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error interno.' });
  }
});

// ---- ACTUALIZAR PERFIL ----
router.put('/profile', async (req, res) => {
  const { email, name, city } = req.body;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });
  try {
    await db.run(`UPDATE users SET name = ?, city = ? WHERE email = ?`, [name, city || '', email]);
    res.json({ message: 'Perfil actualizado.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar perfil.' });
  }
});

// ---- SUBIR FOTO ----
router.post('/profile/photo', upload.single('photo'), async (req, res) => {
  const { email } = req.body;
  if (!email || !req.file) return res.status(400).json({ error: 'Falta el email o la foto.' });
  try {
    const base64  = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;
    const result  = await cloudinary.uploader.upload(dataUri, {
      folder: 'vamos-profiles',
      transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }]
    });
    await db.run(`UPDATE users SET photo_url = ? WHERE email = ?`, [result.secure_url, email]);
    res.json({ message: 'Foto actualizada.', photo_url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Error al subir la foto.' });
  }
});

// ---- PERFIL PÚBLICO ----
router.get('/profile', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });
  try {
    const row = await db.get(
      `SELECT id, name, email, photo_url, city FROM users WHERE email = ?`, [email]
    );
    if (!row) return res.status(404).json({ error: 'Usuario no encontrado.' });
    res.json({ user: row });
  } catch (err) {
    res.status(500).json({ error: 'Error interno.' });
  }
});

module.exports = router;