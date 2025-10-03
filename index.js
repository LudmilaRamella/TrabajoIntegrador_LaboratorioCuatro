// index.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const { engine } = require('express-handlebars');
const passport = require('./config/passport');   // configura estrategia local
const { sequelize } = require('./config/database');
require('dotenv').config();

const app = express();

// handlebars
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: { eq: (a,b)=> a===b }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// flash a las vistas + user
app.use((req, res, next) => {
  res.locals.error = req.flash('error')[0];
  res.locals.success = req.flash('success')[0];
  res.locals.user = req.user || null;
  next();
});

// rutas
const authRoutes = require('./routers/auth');
app.use('/', authRoutes);

// home (ya tenés views/home.hbs)
app.get('/', (req, res) => {
  res.render('home', { title: 'Inicio' });
});

// levantar
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // crea la tabla 'usuarios' si no existe
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
  } catch (e) {
    console.error('Error al iniciar:', e);
  }
})();
