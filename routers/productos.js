const express = require("express");
const Producto = require("../models/producto");
const Categoria = require("../models/categoria");
const { ensureAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// Catálogo visible para usuarios logueados
router.get("/productos", ensureAuth, async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: { model: Categoria, attributes: ["nombre"] },
    });

    res.render("productos", {
      layout: "main",
      user: req.user,
      productos,
      title: "Listado de Productos",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar los productos");
  }
});

module.exports = router;
