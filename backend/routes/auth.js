const express  = require('express');
const router   = express.Router();
const passport = require('passport');

// ── GOOGLE ──
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/?auth=error` }),
  (req, res) => {
    const user   = req.user;
    const params = new URLSearchParams({
      auth:      'ok',
      id:        user.id,
      name:      user.name,
      email:     user.email,
      photo_url: user.photo_url || '',
      city:      user.city      || '',
    });
    // Redirigimos a la raíz con params — funciona siempre en Vite
    res.redirect(`${process.env.FRONTEND_URL}/?${params}`);
  }
);

// ── FACEBOOK ──
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['public_profile'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_URL}/?auth=error` }),
  (req, res) => {
    const user   = req.user;
    const params = new URLSearchParams({
      auth:      'ok',
      id:        user.id,
      name:      user.name,
      email:     user.email,
      photo_url: user.photo_url || '',
      city:      user.city      || '',
    });
    res.redirect(`${process.env.FRONTEND_URL}/?${params}`);
  }
);

module.exports = router;