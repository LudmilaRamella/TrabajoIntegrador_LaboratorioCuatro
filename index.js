require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const { engine } = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const sequelize = require("./config/database");

const app = express();

// =======================
// CONFIGURACIÓN HANDLEBARS
// =======================
app.engine("hbs", engine({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials")
}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// =======================
// MIDDLEWARES
// =======================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// =======================
// CONFIG PASSPORT
// =======================
require("./config/passport")(passport);

// =======================
// RUTAS DE AUTENTICACIÓN (públicas)
// =======================
const authRoutes = require("./routers/auth");
app.use("/", authRoutes);

// =======================
// MIDDLEWARE GLOBAL: BLOQUEA TODO
// =======================
app.use((req, res, next) => {
  // deja pasar solo login y registro
  if (req.path === "/login" || req.path === "/registro") {
    return next();
  }
  // si no hay usuario autenticado -> login
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
});

// =======================
// RUTAS PRIVADAS
// =======================
const { ensureAuth } = require("./middlewares/authMiddleware");

// RUTAS PRIVADAS
app.get("/", ensureAuth, (req, res) => {
  res.render("home", {
    layout: "main",
    mensaje: "Bienvenido al carrito",
    user: req.user
  });
});

app.get("/perfil", ensureAuth, (req, res) => {
  res.render("perfil", {
    layout: "main",
    user: req.user
  });
});

// =======================
// SERVIDOR
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
