const express = require("express");
const { ensureAuth } = require("../middlewares/authMiddleware");
const Producto = require("../models/producto");
const Categoria = require("../models/categoria");

const router = express.Router();

router.get("/catalogo", ensureAuth, async (req, res) => {
  console.log("Ruta /catalogo | Autenticado:", req.isAuthenticated());
  try {
    const productos = await Producto.findAll({
      include: { model: Categoria, attributes: ["nombre"] },
    });

    res.render("catalogo", {
      layout: "main",
      user: req.user,
      productos,
      title: "Catálogo de productos",
    });
  } catch (error) {
    console.error("Error al cargar catálogo:", error);
    res.status(500).send("Error al cargar catálogo");
  }
});

module.exports = router;
