// ============================================================
// ROUTES/RATINGS.JS — Calificaciones entre usuarios
// ============================================================
// POST /api/ratings          → Crear una calificación
// GET  /api/ratings?email=X  → Obtener promedio de un usuario
// GET  /api/ratings/mine?email=X → Ver qué conexiones ya califiqué
// ============================================================

const express = require('express');
const router  = express.Router();
const db      = require('../database');

// ---- CREAR CALIFICACIÓN ----
router.post('/', (req, res) => {
  const { from_email, to_email, connection_id, score, comment } = req.body;

  if (!from_email || !to_email || !connection_id || !score) {
    return res.status(400).json({ error: 'Faltan datos para calificar.' });
  }

  // Validamos que el puntaje sea entre 1 y 5
  if (score < 1 || score > 5) {
    return res.status(400).json({ error: 'El puntaje debe ser entre 1 y 5.' });
  }

  // Verificamos que esta conexión no haya sido calificada ya por este usuario
  db.get(
    `SELECT id FROM ratings WHERE from_email = ? AND connection_id = ?`,
    [from_email, connection_id],
    (err, existing) => {
      if (err) return res.status(500).json({ error: 'Error interno.' });
      if (existing) {
        return res.status(400).json({ error: 'Ya calificaste esta conexión.' });
      }

      // Guardamos la calificación
      db.run(
        `INSERT INTO ratings (from_email, to_email, connection_id, score, comment)
         VALUES (?, ?, ?, ?, ?)`,
        [from_email, to_email, connection_id, score, comment || ''],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          console.log(`⭐ Calificación guardada: ${from_email} → ${to_email} (${score}/5)`);
          res.json({ message: 'Calificación guardada.', ratingId: this.lastID });
        }
      );
    }
  );
});

// ---- OBTENER PROMEDIO DE UN USUARIO ----
// Devuelve: { average: 4.5, count: 12 }
router.get('/', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });

  db.all(
    `SELECT score FROM ratings WHERE to_email = ?`,
    [email],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      if (rows.length === 0) {
        return res.json({ average: null, count: 0 });
      }

      // Calculamos el promedio
      const total   = rows.reduce((sum, r) => sum + r.score, 0);
      const average = (total / rows.length).toFixed(1);

      res.json({ average: parseFloat(average), count: rows.length });
    }
  );
});

// ---- VER QUÉ CONEXIONES YA CALIFIQUÉ ----
// Devuelve una lista de connection_ids que ya calificé
// El frontend la usa para saber si mostrar el botón o no
router.get('/mine', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Falta el email.' });

  db.all(
    `SELECT connection_id FROM ratings WHERE from_email = ?`,
    [email],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      // Devolvemos solo los IDs como array simple: [1, 4, 7]
      res.json({ rated: rows.map(r => r.connection_id) });
    }
  );
});

module.exports = router;