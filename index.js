require("dotenv").config();

if (!process.env.SESSION_SECRET) {
  throw new Error("Falta definir SESSION_SECRET en las variables de entorno");
}

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const passport = require("passport");
const sequelize = require("./config/database");

// =======================
// CONFIGURACIÓN HANDLEBARS
// =======================
const { engine } = require("express-handlebars");
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");

const hbs = engine({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials"),
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    multiply: (a, b) => (a * b).toFixed(2),
    eq: (a, b) => a === b
  },
});

const app = express();
app.engine("hbs", hbs);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// =======================
// MIDDLEWARES
// =======================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// =======================
// CONFIG PASSPORT
// =======================
require("./config/passport")(passport);

// =======================
// RUTAS PÚBLICAS
// =======================


const authRoutes = require("./routers/auth");
const productosRoutes = require("./routers/productos");
const carritoRoutes = require("./routers/carrito");
const categoriasRoutes = require("./routers/categorias");
const catalogoRoutes = require("./routers/catalogo");

// ✅ Montar rutas
app.use("/", authRoutes);
app.use("/", productosRoutes);
app.use("/", carritoRoutes);
app.use("/", categoriasRoutes);
app.use("/", catalogoRoutes);


// =======================
// MIDDLEWARE GLOBAL: BLOQUEO DE RUTAS
// =======================
app.use((req, res, next) => {
  // Deja pasar solo login y registro
  if (req.path === "/login" || req.path === "/registro") return next();

  // Si no hay usuario autenticado → redirige a login
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect("/login");
  }

  next();
});

// =======================
// RUTAS PRIVADAS
// =======================
const { ensureAuth } = require("./middlewares/authMiddleware");

app.get("/", ensureAuth, (req, res) => {
  res.render("home", {
    layout: "main",
    mensaje: "Bienvenido al carrito",
    user: req.user,
  });
});

app.get("/perfil", ensureAuth, (req, res) => {
  res.render("perfil", {
    layout: "main",
    user: req.user,
  });
});

// =======================
// SERVIDOR
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
