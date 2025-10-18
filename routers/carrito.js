const express = require("express");
const { ensureAuth } = require("../middlewares/authMiddleware");
const Carrito = require("../models/carrito");
const ItemCarrito = require("../models/itemCarrito");
const Producto = require("../models/producto");

const router = express.Router();

// Vista del carrito actual
router.get("/carrito", ensureAuth, async (req, res) => {
  try {
    const carrito = await Carrito.findOne({
      where: { usuario_id: req.user.id, estado: "activo" },
      include: {
        model: ItemCarrito,
        include: [Producto],
      },
    });

    let total = 0;
    if (carrito) {
      carrito.ItemCarritos.forEach(item => {
        total += item.cantidad * item.precio_actual;
      });
    }

    res.render("carrito", {
      layout: "main",
      user: req.user,
      carrito,
      total,
      title: "Mi Carrito",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el carrito");
  }
});

// Agregar producto al carrito
router.get("/carrito/agregar/:id", ensureAuth, async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).send("Producto no encontrado");

    // Buscar carrito activo o crear uno
    let carrito = await Carrito.findOne({ where: { usuario_id: req.user.id, estado: "activo" } });
    if (!carrito) {
      carrito = await Carrito.create({ usuario_id: req.user.id });
    }

    // Ver si ya existe el ítem
    let item = await ItemCarrito.findOne({
      where: { carrito_id: carrito.id, producto_id: producto.id },
    });

    if (item) {
      item.cantidad += 1;
      await item.save();
    } else {
      await ItemCarrito.create({
        carrito_id: carrito.id,
        producto_id: producto.id,
        cantidad: 1,
        precio_actual: producto.precio,
      });
    }

    res.redirect("/carrito");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar producto al carrito");
  }
});

module.exports = router;
