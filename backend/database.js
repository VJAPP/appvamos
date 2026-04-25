const sqlite3 = require('sqlite3').verbose();
const path    = require('path');

const DB_PATH = path.join(__dirname, 'vamos.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('❌ Error conectando:', err.message);
  else console.log('✅ Base de datos conectada en:', DB_PATH);
});

// ---- TABLA: users ----
// photo_url = link de la foto guardada en Cloudinary
// city      = ciudad base del usuario (ej: "Gualeguaychú")
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT NOT NULL,
    email     TEXT NOT NULL UNIQUE,
    password  TEXT NOT NULL,
    photo_url TEXT DEFAULT '',
    city      TEXT DEFAULT ''
  )
`, (err) => {
  if (err) console.error('❌ Error tabla users:', err.message);
  else console.log('✅ Tabla users lista.');
});

// ---- TABLA: trips ----
db.run(`
  CREATE TABLE IF NOT EXISTS trips (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_name   TEXT NOT NULL,
    creator_email  TEXT NOT NULL,
    creator_photo  TEXT DEFAULT '',
    type           TEXT NOT NULL,
    origin         TEXT NOT NULL,
    destination    TEXT NOT NULL,
    date           TEXT NOT NULL,
    collaboration  TEXT NOT NULL,
    description    TEXT DEFAULT '',
    contact_method TEXT DEFAULT 'whatsapp',
    contact_info   TEXT DEFAULT ''
  )
`, (err) => {
  if (err) console.error('❌ Error tabla trips:', err.message);
  else console.log('✅ Tabla trips lista.');
});

// ---- TABLA: connections ----
db.run(`
  CREATE TABLE IF NOT EXISTS connections (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id         INTEGER NOT NULL,
    requester_name  TEXT NOT NULL,
    requester_email TEXT NOT NULL,
    owner_name      TEXT NOT NULL,
    owner_email     TEXT NOT NULL,
    origin          TEXT DEFAULT '',
    destination     TEXT DEFAULT '',
    date            TEXT DEFAULT '',
    collaboration   TEXT DEFAULT '',
    contact_method  TEXT DEFAULT 'whatsapp',
    contact_info    TEXT DEFAULT '',
    created_at      TEXT DEFAULT (datetime('now'))
  )
`, (err) => {
  if (err) console.error('❌ Error tabla connections:', err.message);
  else console.log('✅ Tabla connections lista.');
});

// ---- TABLA: products ----
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_name   TEXT NOT NULL,
    creator_email  TEXT NOT NULL,
    creator_photo  TEXT DEFAULT '',
    type           TEXT NOT NULL,
    origin         TEXT NOT NULL,
    destination    TEXT NOT NULL,
    date           TEXT NOT NULL,
    description    TEXT DEFAULT '',
    package_size   TEXT DEFAULT 'pequeño',
    collaboration  TEXT NOT NULL,
    contact_method TEXT DEFAULT 'whatsapp',
    contact_info   TEXT DEFAULT ''
  )
`, (err) => {
  if (err) console.error('❌ Error tabla products:', err.message);
  else console.log('✅ Tabla products lista.');
});

// ---- TABLA: product_connections ----
db.run(`
  CREATE TABLE IF NOT EXISTS product_connections (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id      INTEGER NOT NULL,
    requester_name  TEXT NOT NULL,
    requester_email TEXT NOT NULL,
    owner_name      TEXT NOT NULL,
    owner_email     TEXT NOT NULL,
    origin          TEXT DEFAULT '',
    destination     TEXT DEFAULT '',
    date            TEXT DEFAULT '',
    collaboration   TEXT DEFAULT '',
    contact_method  TEXT DEFAULT 'whatsapp',
    contact_info    TEXT DEFAULT '',
    created_at      TEXT DEFAULT (datetime('now'))
  )
`, (err) => {
  if (err) console.error('❌ Error tabla product_connections:', err.message);
  else console.log('✅ Tabla product_connections lista.');
});
// ---- TABLA: ratings (calificaciones entre usuarios) ----
db.run(`
  CREATE TABLE IF NOT EXISTS ratings (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    from_email   TEXT NOT NULL,
    to_email     TEXT NOT NULL,
    connection_id INTEGER NOT NULL,
    score        INTEGER NOT NULL,
    comment      TEXT DEFAULT '',
    created_at   TEXT DEFAULT (datetime('now'))
  )
`, (err) => {
  if (err) console.error('❌ Error tabla ratings:', err.message);
  else console.log('✅ Tabla ratings lista.');
});
module.exports = db;