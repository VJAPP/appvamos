// ============================================================
// CONFIG/PASSPORT.JS — Configuración de login social
// ============================================================
// Passport es como un "portero" que sabe hablar con Google
// y Facebook. Le decimos cómo identificar a un usuario cuando
// vuelve de esas plataformas y qué hacer con sus datos.
// ============================================================

const passport          = require('passport');
const GoogleStrategy    = require('passport-google-oauth20').Strategy;
const FacebookStrategy  = require('passport-facebook').Strategy;
const db                = require('../database');
console.log('Google ID cargado:', process.env.GOOGLE_CLIENT_ID ? 'SI' : 'NO');
console.log('Facebook ID cargado:', process.env.FACEBOOK_APP_ID ? 'SI' : 'NO');
// ── GOOGLE ──
passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  'http://localhost:3000/api/auth/google/callback',
  },
  // Esta función se ejecuta cuando Google nos devuelve los datos del usuario
  (accessToken, refreshToken, profile, done) => {
    const email    = profile.emails[0].value;
    const name     = profile.displayName;
    const photoUrl = profile.photos[0]?.value || '';

    // Buscamos si ya existe un usuario con ese email
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
      if (err) return done(err);

      if (user) {
        // Ya existe — actualizamos la foto si no tenía
        if (!user.photo_url && photoUrl) {
          db.run(`UPDATE users SET photo_url = ? WHERE email = ?`, [photoUrl, email]);
        }
        return done(null, user);
      }

      // No existe — lo creamos automáticamente
      // La contraseña es un string vacío porque no la necesita (usa OAuth)
      db.run(
        `INSERT INTO users (name, email, password, photo_url) VALUES (?, ?, ?, ?)`,
        [name, email, '', photoUrl],
        function (err) {
          if (err) return done(err);
          db.get(`SELECT * FROM users WHERE id = ?`, [this.lastID], (err, newUser) => {
            return done(null, newUser);
          });
        }
      );
    });
  }
));

// ── FACEBOOK ──
passport.use(new FacebookStrategy(
  {
    clientID:     process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL:  'http://localhost:3000/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'photos'],
  },
  (accessToken, refreshToken, profile, done) => {
    // Facebook a veces no devuelve email — usamos un email alternativo
    const email    = profile.emails?.[0]?.value || `fb_${profile.id}@facebook.com`;
    const name     = profile.displayName;
    const photoUrl = profile.photos?.[0]?.value || '';

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
      if (err) return done(err);

      if (user) {
        if (!user.photo_url && photoUrl) {
          db.run(`UPDATE users SET photo_url = ? WHERE email = ?`, [photoUrl, email]);
        }
        return done(null, user);
      }

      db.run(
        `INSERT INTO users (name, email, password, photo_url) VALUES (?, ?, ?, ?)`,
        [name, email, '', photoUrl],
        function (err) {
          if (err) return done(err);
          db.get(`SELECT * FROM users WHERE id = ?`, [this.lastID], (err, newUser) => {
            return done(null, newUser);
          });
        }
      );
    });
  }
));

// ── Serialización ──
// Passport necesita saber cómo guardar y recuperar al usuario en la sesión
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, user) => done(err, user));
});

module.exports = passport;
console.log('Estrategias registradas:', Object.keys(passport._strategies));