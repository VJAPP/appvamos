// ============================================================
// ROUTES/USERS.JS — Usuarios con perfil y foto
// ============================================================

const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcrypt');
const multer    = require('multer');
const cloudinary = require('cloudinary').v2;
const db        = require('../database');

const SALT_ROUNDS = 10;

// ── Configuramos Cloudinary con las credenciales del .env ──
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer: recibe el archivo en memoria (sin guardarlo en disco) ──
// memoryStorage significa que el archivo vive temporalmente en RAM
// hasta que lo enviamos a Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

// ---- REGISTRO ----
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

    db.run(sql, [name, email, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Ese email ya está registrado.' });
        }
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }
      res.json({ message: 'Registro exitoso.', userId: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la contraseña.' });
  }
});

// ---- LOGIN ----
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
  }

  try {
    db.get(
      `SELECT id, name, email, password, photo_url, city FROM users WHERE email = ?`,
      [email],
      async (err, row) => {
        if (err) return res.status(500).json({ error: 'Error interno.' });
        if (!row) return res.status(401).json({ error: 'Email o contraseña incorrectos.' });

        const passwordMatch = await bcrypt.compare(password, row.password);

        if (passwordMatch) {
          res.json({
            message: 'Login exitoso.',
            // Devolvemos todos los datos del perfil (sin la contraseña)
            user: {
              id:        row.id,
              name:      row.name,
              email:     row.email,
              photo_url: row.photo_url || '',
              city:      row.city || '',
            }
          });
        } else {
          res.status(401).json({ error: 'Email o contraseña incorrectos.' });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar la contraseña.' });
  }
});

// ---- ACTUALIZAR PERFIL (nombre y ciudad) ----
router.put('/profile', (req, res) => {
  const { email, name, city } = req.body;

  if (!email) return res.status(400).json({ error: 'Falta el email.' });

  db.run(
    `UPDATE users SET name = ?, city = ? WHERE email = ?`,
    [name, city || '', email],
    function (err) {
      if (err) return res.status(500).json({ error: 'Error al actualizar perfil.' });
      res.json({ message: 'Perfil actualizado.' });
    }
  );
});

// ---- SUBIR FOTO DE PERFIL ----
// "upload.single('photo')" indica que esperamos UN archivo con el nombre 'photo'
router.post('/profile/photo', upload.single('photo'), async (req, res) => {
  const { email } = req.body;

  if (!email || !req.file) {
    return res.status(400).json({ error: 'Falta el email o la foto.' });
  }

  try {
    // Convertimos el archivo a base64 para enviárselo a Cloudinary
    const base64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    // Subimos la imagen a Cloudinary
    // folder: 'vamos-profiles' = carpeta donde se guardan las fotos en Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'vamos-profiles',
      // Redimensionamos a 200x200 automáticamente para no gastar espacio
      transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }]
    });

    // Guardamos la URL de la imagen en la base de datos
    db.run(
      `UPDATE users SET photo_url = ? WHERE email = ?`,
      [result.secure_url, email],
      function (err) {
        if (err) return res.status(500).json({ error: 'Error al guardar la foto.' });
        // Devolvemos la URL para que el frontend la muestre de inmediato
        res.json({ message: 'Foto actualizada.', photo_url: result.secure_url });
      }
    );
  } catch (error) {
    console.error('Error subiendo foto:', error);
    res.status(500).json({ error: 'Error al subir la foto a Cloudinary.' });
  }
});

// ---- OBTENER PERFIL PÚBLICO (por email) ----
router.get('/profile', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });

  db.get(
    `SELECT id, name, email, photo_url, city FROM users WHERE email = ?`,
    [email],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Error interno.' });
      if (!row) return res.status(404).json({ error: 'Usuario no encontrado.' });
      res.json({ user: row });
    }
  );
});

module.exports = router;