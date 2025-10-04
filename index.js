require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const { engine } = require("express-handlebars");
const path = require("path");

const app = express();

// Configuración Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Rutas (ejemplo)
app.get("/", (req, res) => {
  res.render("home", { mensaje: "Bienvenido al carrito" });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
