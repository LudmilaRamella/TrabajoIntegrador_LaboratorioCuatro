const express = require("express");
const { ensureAuth } = require("../middlewares/authMiddleware");
const Categoria = require("../models/categoria");

const router = express.Router();

// Mostrar todas las categorías
router.get("/categorias", ensureAuth, async (req, res) => {
  console.log("Ruta /categorias | Autenticado:", req.isAuthenticated());
  try {
    const categorias = await Categoria.findAll();
    res.render("categorias", {
      layout: "main",
      user: req.user,
      categorias,
      title: "Categorías de productos",
    });
  } catch (error) {
    console.error("Error al cargar categorías:", error);
    res.status(500).send("Error al cargar categorías");
  }
});

module.exports = router;
