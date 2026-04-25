require('dotenv').config();

// ── IMPORTANTE: passport y sus estrategias deben cargarse
// ANTES que cualquier ruta que los use ──
const passport       = require('passport');
const configPassport = require('./config/passport');

const express = require('express');
const cors    = require('cors');
const session = require('express-session');

const usersRouter       = require('./routes/users');
const tripsRouter       = require('./routes/trips');
const connectionsRouter = require('./routes/requests');
const productsRouter    = require('./routes/products');
const ratingsRouter     = require('./routes/ratings');
const authRouter        = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret:            process.env.SESSION_SECRET || 'vamos-secreto',
  resave:            false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users',       usersRouter);
app.use('/api/trips',       tripsRouter);
app.use('/api/connections', connectionsRouter);
app.use('/api/products',    productsRouter);
app.use('/api/ratings',     ratingsRouter);
app.use('/api/auth',        authRouter);

app.get('/api/status', (req, res) => {
  res.json({ status: 'online', project: 'VAMOS' });
});

app.listen(PORT, () => {
  console.log(`\nServidor VAMOS corriendo en http://localhost:${PORT}\n`);
});