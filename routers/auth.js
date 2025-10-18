const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Usuario = require("../models/usuario");

const router = express.Router();

// ====================================
// FORMULARIO LOGIN
// ====================================
router.get("/login", (req, res) => {
  res.render("auth/login", { layout: "main" });
});

// ====================================
// FORMULARIO REGISTRO
// ====================================
router.get("/registro", (req, res) => {
  res.render("auth/registro", { layout: "main" });
});

// ====================================
// PROCESAR REGISTRO
// ====================================
router.post("/registro", async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  try {
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.render("auth/registro", {
        layout: "main",
        error: "El email ya está registrado",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    await Usuario.create({ nombre, apellido, email, password: hashed });
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.render("auth/registro", { layout: "main", error: "Error al registrar usuario" });
  }
});

// ====================================
// PROCESAR LOGIN
// ====================================
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// ====================================
// LOGOUT
// ====================================
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
});

module.exports = router;
