// routers/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../controllers/authController');


// Registro
router.get('/registro', auth.register_get);
router.post('/registro', auth.register_post);

// Login
router.get('/login', auth.login_get);
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => res.redirect('/')
);

// Logout
router.get('/logout', auth.logout_get);

module.exports = router;
