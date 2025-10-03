// controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const register_get = (req, res) => {
  res.render('auth/register', { title: 'Registro' });
};

const register_post = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
      req.flash('error', 'Todos los campos son obligatorios.');
      return res.redirect('/registro');
    }

    const existe = await User.findOne({ where: { email } });
    if (existe) {
      req.flash('error', 'El email ya está registrado.');
      return res.redirect('/registro');
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({ nombre, apellido, email, password_hash: hash });

    req.flash('success', 'Registro exitoso. Iniciá sesión.');
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Ocurrió un error al registrarte.');
    res.redirect('/registro');
  }
};

const login_get = (req, res) => {
  res.render('auth/login', { title: 'Ingresar' });
};

const logout_get = (req, res) => {
  req.logout(() => {});
  res.redirect('/');
};

// ✅ Exportamos todas las funciones de forma clara
module.exports = {
  register_get,
  register_post,
  login_get,
  logout_get
};
