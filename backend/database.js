// ============================================================
// DATABASE.JS — Conexión a PostgreSQL (Neon)
// ============================================================
// Cambiamos de SQLite (archivo local) a PostgreSQL (nube).
// Los datos ahora viven en Neon y nunca se borran.
// ============================================================

const { Pool } = require('pg');

// Nos conectamos usando la connection string de Neon
// En local usamos SQLite pero en producción usamos Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

// Función helper que hace las queries más simples de escribir
// En vez de db.run(sql, params, callback) usamos db.run(sql, params)
// y devuelve una promesa
const db = {
  // Para SELECT que devuelve múltiples filas
  all: async (sql, params = []) => {
    const sqlPg = convertSQL(sql);
    const result = await pool.query(sqlPg, params);
    return result.rows;
  },

  // Para SELECT que devuelve una sola fila
  get: async (sql, params = []) => {
    const sqlPg = convertSQL(sql);
    const result = await pool.query(sqlPg, params);
    return result.rows[0] || null;
  },

  // Para INSERT, UPDATE, DELETE
  run: async (sql, params = []) => {
    const sqlPg = convertSQL(sql);
    // Para INSERT devolvemos el id del registro creado
    let finalSQL = sqlPg;
    if (sqlPg.trim().toUpperCase().startsWith('INSERT')) {
      finalSQL = sqlPg + ' RETURNING id';
    }
    const result = await pool.query(finalSQL, params);
    return {
      lastID: result.rows[0]?.id || null,
      changes: result.rowCount,
    };
  },

  query: async (sql, params = []) => {
    return pool.query(sql, params);
  },
};

// SQLite usa ? como placeholder, PostgreSQL usa $1, $2, $3...
// Esta función convierte automáticamente
function convertSQL(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

// Crear todas las tablas si no existen
async function initDB() {
  console.log('🔧 Inicializando base de datos PostgreSQL...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id        SERIAL PRIMARY KEY,
      name      TEXT NOT NULL,
      email     TEXT NOT NULL UNIQUE,
      password  TEXT NOT NULL,
      photo_url TEXT DEFAULT '',
      city      TEXT DEFAULT ''
    )
  `);
  console.log('✅ Tabla users lista.');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS trips (
      id             SERIAL PRIMARY KEY,
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
    contact_info   TEXT DEFAULT '',
    date_created   TEXT DEFAULT to_char(NOW(), 'YYYY-MM-DD')
  )
  `);
  console.log('✅ Tabla trips lista.');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS connections (
      id              SERIAL PRIMARY KEY,
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
      created_at      TEXT DEFAULT to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS')
    )
  `);
  console.log('✅ Tabla connections lista.');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id             SERIAL PRIMARY KEY,
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
  `);
  console.log('✅ Tabla products lista.');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_connections (
      id              SERIAL PRIMARY KEY,
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
      created_at      TEXT DEFAULT to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS')
    )
  `);
  console.log('✅ Tabla product_connections lista.');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id            SERIAL PRIMARY KEY,
      from_email    TEXT NOT NULL,
      to_email      TEXT NOT NULL,
      connection_id INTEGER NOT NULL,
      score         INTEGER NOT NULL,
      comment       TEXT DEFAULT '',
      created_at    TEXT DEFAULT to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS')
    )
  `);
  console.log('✅ Tabla ratings lista.');

  console.log('✅ Base de datos PostgreSQL inicializada correctamente.');
}

// Inicializamos las tablas al arrancar el servidor
initDB().catch(console.error);

module.exports = db;