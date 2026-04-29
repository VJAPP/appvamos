const passport         = require('passport');
const GoogleStrategy   = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db               = require('../database');

console.log('🔑 Google Client ID cargado:', process.env.GOOGLE_CLIENT_ID ? 'SI ✅' : 'NO ❌');
console.log('🔑 Facebook App ID cargado:', process.env.FACEBOOK_APP_ID ? 'SI ✅' : 'NO ❌');

passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  'https://vamos-backend-ggqq.onrender.com/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email    = profile.emails[0].value;
      const name     = profile.displayName;
      const photoUrl = profile.photos[0]?.value || '';
      let user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
      if (user) {
        if (!user.photo_url && photoUrl) await db.run(`UPDATE users SET photo_url = ? WHERE email = ?`, [photoUrl, email]);
        return done(null, user);
      }
      await db.run(`INSERT INTO users (name, email, password, photo_url) VALUES (?, ?, ?, ?)`, [name, email, '', photoUrl]);
      user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.use(new FacebookStrategy(
  {
    clientID:      process.env.FACEBOOK_APP_ID,
    clientSecret:  process.env.FACEBOOK_APP_SECRET,
    callbackURL:   'https://vamos-backend-ggqq.onrender.com/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'photos'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email    = profile.emails?.[0]?.value || `fb_${profile.id}@facebook.com`;
      const name     = profile.displayName;
      const photoUrl = profile.photos?.[0]?.value || '';
      let user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
      if (user) {
        if (!user.photo_url && photoUrl) await db.run(`UPDATE users SET photo_url = ? WHERE email = ?`, [photoUrl, email]);
        return done(null, user);
      }
      await db.run(`INSERT INTO users (name, email, password, photo_url) VALUES (?, ?, ?, ?)`, [name, email, '', photoUrl]);
      user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.get(`SELECT * FROM users WHERE id = ?`, [id]);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;